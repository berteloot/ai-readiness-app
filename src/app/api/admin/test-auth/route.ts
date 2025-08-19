import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Test authentication middleware
    const authResult = await adminAuthMiddleware(request);
    
    if (authResult) {
      // Authentication failed
      return authResult;
    }
    
    // Authentication successful
    return NextResponse.json({ 
      success: true, 
      message: 'Authentication test passed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { error: 'Authentication test failed' },
      { status: 500 }
    );
  }
}
