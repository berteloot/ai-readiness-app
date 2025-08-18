import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }
    
    const result = await validateAdminPassword(password);
    
    if (result.success && result.token) {
      return NextResponse.json({ 
        success: true, 
        token: result.token,
        message: 'Login successful'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Authentication failed' },
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
