import { NextRequest, NextResponse } from 'next/server';

// Simple admin authentication - no complex security protocols
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

/**
 * Simple password validation
 */
export function validateAdminPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }
  
  return password === ADMIN_PASSWORD;
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
 * Simple authentication middleware - no complex security checks
 */
export async function adminAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Simple token validation - just check if it matches the password
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Add admin user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-user', JSON.stringify(createAdminUser()));
    
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
 * Get admin user from request headers
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
 * Simple admin authentication function
 */
export async function authenticateAdmin(password: string): Promise<{ 
  success: boolean; 
  token?: string; 
  error?: string;
}> {
  if (!ADMIN_PASSWORD) {
    return { success: false, error: 'Admin access not configured' };
  }
  
  if (password === ADMIN_PASSWORD) {
    // Return the password as the token (simple approach)
    return { 
      success: true, 
      token: password
    };
  } else {
    return { 
      success: false, 
      error: 'Invalid password'
    };
  }
}
