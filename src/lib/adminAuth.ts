import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

function getJwtSecret(): string {
  // Use a dedicated JWT_SECRET if available, otherwise derive from ADMIN_PASSWORD
  return process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || '';
}

const JWT_EXPIRATION = '8h';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

/**
 * Simple password validation
 */
export function validateAdminPassword(password: string): boolean {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }
  return password === adminPassword;
}

/**
 * Create a simple admin user object
 */
export function createAdminUser(): AdminUser {
  return {
    id: 'admin',
    email: 'admin@ai-readiness-app.com',
    role: 'admin'
  };
}

/**
 * Generate a signed JWT token for an authenticated admin
 */
function generateToken(): string {
  const secret = getJwtSecret();
  const user = createAdminUser();
  return jwt.sign(
    { sub: user.id, role: user.role },
    secret,
    { expiresIn: JWT_EXPIRATION }
  );
}

/**
 * Verify a JWT token and return whether it's valid
 */
function verifyToken(token: string): boolean {
  try {
    const secret = getJwtSecret();
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

/**
 * Authentication middleware for admin routes
 */
export async function adminAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    if (!getJwtSecret()) {
      console.error('Admin auth not configured');
      return NextResponse.json(
        { error: 'Admin access not configured' },
        { status: 500 }
      );
    }

    if (!verifyToken(token)) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add admin user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-user', JSON.stringify(createAdminUser()));

    return null;
  } catch (error) {
    console.error('Admin auth middleware error');
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Get admin user from request headers
 */
export function getAdminUserFromRequest(request: NextRequest): AdminUser | null {
  try {
    const adminUserHeader = request.headers.get('x-admin-user');
    if (!adminUserHeader) return null;
    return JSON.parse(adminUserHeader) as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Authenticate admin with password, return a JWT token
 */
export async function authenticateAdmin(password: string): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return { success: false, error: 'Admin access not configured' };
  }

  if (password === adminPassword) {
    return {
      success: true,
      token: generateToken()
    };
  } else {
    return {
      success: false,
      error: 'Invalid password'
    };
  }
}
