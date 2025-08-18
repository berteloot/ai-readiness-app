import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

// Admin session configuration
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback-secret-change-in-production';
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 100; // Max requests per 15 minutes per IP

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

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
  
  const { sign } = require('jsonwebtoken');
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
 * Clean up expired rate limit records
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

// Clean up expired records every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

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
 * Validate admin password and create session
 */
export async function validateAdminPassword(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return { success: false, error: 'Admin access not configured' };
  }
  
  if (password !== adminPassword) {
    return { success: false, error: 'Invalid password' };
  }
  
  const token = createAdminToken('admin');
  return { success: true, token };
}
