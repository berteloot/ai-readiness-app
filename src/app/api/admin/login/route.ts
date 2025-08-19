import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    console.log('Admin login POST request received');
    
    const { password } = await request.json();
    console.log('Password received, length:', password?.length);
    console.log('Password received (first 100 chars):', password?.substring(0, 100));
    console.log('Password received (last 100 chars):', password?.substring(Math.max(0, (password?.length || 0) - 100)));
    
    if (!password) {
      console.log('No password provided');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }
    
    console.log('Calling authenticateAdmin...');
    // Simple password authentication
    const result = await authenticateAdmin(password);
    console.log('authenticateAdmin result:', result);
    
    if (result.success && result.token) {
      console.log('Login successful');
      return NextResponse.json({ 
        success: true, 
        token: result.token,
        message: 'Login successful'
      });
    } else {
      console.log('Login failed:', result.error);
      return NextResponse.json(
        { 
          error: result.error || 'Authentication failed'
        },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
