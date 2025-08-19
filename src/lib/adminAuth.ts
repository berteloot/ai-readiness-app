import { NextRequest, NextResponse } from 'next/server';

// Simple admin authentication - no complex security protocols
// Load environment variable dynamically
function getAdminPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD;
  console.log('getAdminPassword called, result:', password ? 'SET' : 'NOT SET');
  return password;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

/**
 * Simple password validation
 */
export function validateAdminPassword(password: string): boolean {
  console.log('validateAdminPassword called with password length:', password?.length);
  const adminPassword = getAdminPassword();
  console.log('ADMIN_PASSWORD environment variable:', adminPassword ? 'SET' : 'NOT SET');
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }
  
  const isValid = password === adminPassword;
  console.log('Password validation result:', isValid);
  return isValid;
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
    console.log('Middleware: authHeader received:', authHeader ? 'yes' : 'no');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Middleware: Invalid auth header format');
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    console.log('Middleware: token extracted, length:', token?.length);
    
    // Simple token validation - just check if it matches the password
    const adminPassword = getAdminPassword();
    console.log('Middleware: adminPassword loaded:', adminPassword ? 'yes' : 'no');
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set in middleware');
      return NextResponse.json(
        { error: 'Admin access not configured' },
        { status: 500 }
      );
    }

    console.log('Middleware: token comparison - token === adminPassword:', token === adminPassword);
    if (token !== adminPassword) {
      console.log('Middleware: Token validation failed');
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
  console.log('authenticateAdmin called with password length:', password?.length);
  const adminPassword = getAdminPassword();
  console.log('ADMIN_PASSWORD environment variable:', adminPassword ? 'SET' : 'NOT SET');
  console.log('Stored password value:', adminPassword);
  console.log('Received password value:', password);
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set in authenticateAdmin');
    return { success: false, error: 'Admin access not configured' };
  }
  
  if (password === adminPassword) {
    console.log('Password match successful');
    // Return the password as the token (simple approach)
    return { 
      success: true, 
      token: password
    };
  } else {
    console.log('Password match failed');
    console.log('Password comparison:');
    console.log('  Stored length:', adminPassword.length);
    console.log('  Received length:', password.length);
    console.log('  Stored === Received:', adminPassword === password);
    return { 
      success: false, 
      error: 'Invalid password'
    };
  }
}
