import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, generateCSRFToken, getClientIP } from '@/lib/adminAuth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for brute force protection
    const clientIP = getClientIP(request);
    
    // Check if this is a login attempt or CSRF token request
    const contentType = request.headers.get('content-type');
    
    if (contentType === 'application/json') {
      // This is a login attempt
      const { password, csrfToken } = await request.json();
      
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        );
      }
      
      // Get stored CSRF token from cookies
      const cookieStore = await cookies();
      const storedCSRFToken = cookieStore.get('admin_csrf')?.value;
      
      if (!storedCSRFToken || !csrfToken || csrfToken !== storedCSRFToken) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
      
      // Validate password with brute force protection
      const result = await validateAdminPassword(password, clientIP, csrfToken);
      
      if (result.success && result.token) {
        // Create response with token
        const response = NextResponse.json({ 
          success: true, 
          token: result.token,
          message: 'Login successful',
          remainingAttempts: result.remainingAttempts
        });
        
        // Clear CSRF token after successful login
        response.cookies.delete('admin_csrf');
        
        // Set secure session cookie
        response.cookies.set('admin_session', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60, // 24 hours
          path: '/'
        });
        
        return response;
      } else {
        return NextResponse.json(
          { 
            error: result.error || 'Authentication failed',
            remainingAttempts: result.remainingAttempts,
            blockedUntil: result.blockedUntil
          },
          { status: 401 }
        );
      }
    } else {
      // This is a CSRF token request
      const csrfToken = generateCSRFToken();
      
      const response = NextResponse.json({ 
        csrfToken,
        message: 'CSRF token generated'
      });
      
      // Set CSRF token in httpOnly cookie
      response.cookies.set('admin_csrf', csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/'
      });
      
      return response;
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CSRF token requests
export async function GET(request: NextRequest) {
  try {
    const csrfToken = generateCSRFToken();
    
    const response = NextResponse.json({ 
      csrfToken,
      message: 'CSRF token generated'
    });
    
    // Set CSRF token in httpOnly cookie
    response.cookies.set('admin_csrf', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
