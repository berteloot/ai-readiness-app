import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify, sign } from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';

// Admin session configuration
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback-secret-change-in-production';
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 100; // Max requests per 15 minutes per IP

// Brute force protection
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5; // Max login attempts per 15 minutes per IP
const BRUTE_FORCE_BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes block

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const loginAttemptStore = new Map<string, { attempts: number; resetTime: number; blockedUntil: number | null }>();

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

export interface LoginAttempt {
  ip: string;
  timestamp: number;
  success: boolean;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

/**
 * Hash password for comparison (timing attack resistant)
 */
function securePasswordCompare(inputPassword: string, storedPassword: string): boolean {
  if (inputPassword.length !== storedPassword.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < inputPassword.length; i++) {
    result |= inputPassword.charCodeAt(i) ^ storedPassword.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Check brute force protection
 */
function checkBruteForceProtection(ip: string): { allowed: boolean; remainingAttempts: number; blockedUntil: number | null } {
  const now = Date.now();
  const record = loginAttemptStore.get(ip);
  
  if (!record) {
    // First attempt
    loginAttemptStore.set(ip, {
      attempts: 1,
      resetTime: now + LOGIN_ATTEMPT_WINDOW,
      blockedUntil: null
    });
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1, blockedUntil: null };
  }
  
  // Check if currently blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    return { 
      allowed: false, 
      remainingAttempts: 0, 
      blockedUntil: record.blockedUntil 
    };
  }
  
  // Check if window has reset
  if (now > record.resetTime) {
    loginAttemptStore.set(ip, {
      attempts: 1,
      resetTime: now + LOGIN_ATTEMPT_WINDOW,
      blockedUntil: null
    });
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1, blockedUntil: null };
  }
  
  // Check if max attempts reached
  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    // Block this IP
    const blockedUntil = now + BRUTE_FORCE_BLOCK_DURATION;
    record.blockedUntil = blockedUntil;
    return { allowed: false, remainingAttempts: 0, blockedUntil };
  }
  
  // Increment attempts
  record.attempts++;
  return { 
    allowed: true, 
    remainingAttempts: MAX_LOGIN_ATTEMPTS - record.attempts, 
    blockedUntil: null 
  };
}

/**
 * Record login attempt
 */
function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  const record = loginAttemptStore.get(ip);
  
  if (success && record) {
    // Reset attempts on successful login
    record.attempts = 0;
    record.blockedUntil = null;
  }
}

/**
 * Clean up expired records
 */
function cleanupStores() {
  const now = Date.now();
  
  // Clean rate limit store
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
  
  // Clean login attempt store
  for (const [ip, record] of loginAttemptStore.entries()) {
    if (now > record.resetTime && (!record.blockedUntil || now > record.blockedUntil)) {
      loginAttemptStore.delete(ip);
    }
  }
}

// Clean up expired records every 5 minutes
setInterval(cleanupStores, 5 * 60 * 1000);

/**
 * Verify admin authentication token
 */
export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = verify(token, ADMIN_SESSION_SECRET) as AdminUser;
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Create admin authentication token
 */
export function createAdminToken(email: string): string {
  const payload: Omit<AdminUser, 'iat' | 'exp'> = {
    id: 'admin',
    email,
    role: 'admin'
  };
  
  return sign(payload, ADMIN_SESSION_SECRET, { 
    expiresIn: '24h',
    issuer: 'ai-readiness-app',
    audience: 'admin'
  });
}

/**
 * Rate limiting middleware
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Admin authentication middleware
 */
export async function adminAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const adminUser = verifyAdminToken(token);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Check if token is expired
    if (adminUser.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }
    
    // Add admin user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-user', JSON.stringify(adminUser));
    
    // Continue with the request
    return null;
    
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Get admin user from request headers (set by middleware)
 */
export function getAdminUserFromRequest(request: NextRequest): AdminUser | null {
  try {
    const adminUserHeader = request.headers.get('x-admin-user');
    if (!adminUserHeader) return null;
    
    return JSON.parse(adminUserHeader) as AdminUser;
  } catch (error) {
    return null;
  }
}

/**
 * Validate admin password and create session with security measures
 */
export async function validateAdminPassword(password: string, ip: string, csrfToken?: string): Promise<{ 
  success: boolean; 
  token?: string; 
  error?: string;
  remainingAttempts?: number;
  blockedUntil?: number;
}> {
  // Check brute force protection first
  const bruteForceCheck = checkBruteForceProtection(ip);
  if (!bruteForceCheck.allowed) {
    return { 
      success: false, 
      error: `Too many failed attempts. Try again after ${Math.ceil((bruteForceCheck.blockedUntil! - Date.now()) / 60000)} minutes.`,
      blockedUntil: bruteForceCheck.blockedUntil
    };
  }
  
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return { success: false, error: 'Admin access not configured' };
  }
  
  // Use timing-attack resistant comparison
  const isValidPassword = securePasswordCompare(password, adminPassword);
  
  if (isValidPassword) {
    // Record successful attempt
    recordLoginAttempt(ip, true);
    
    const token = createAdminToken('admin');
    return { 
      success: true, 
      token,
      remainingAttempts: bruteForceCheck.remainingAttempts
    };
  } else {
    // Record failed attempt
    recordLoginAttempt(ip, false);
    
    return { 
      success: false, 
      error: 'Invalid password',
      remainingAttempts: bruteForceCheck.remainingAttempts
    };
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  return request.ip || 
         request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}
