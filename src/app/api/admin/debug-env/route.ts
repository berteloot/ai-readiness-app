import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envVars = {
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
      ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD?.length || 0,
      NODE_ENV: process.env.NODE_ENV,
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => key.includes('ADMIN')),
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    };
    
    console.log('Debug environment variables:', envVars);
    
    return NextResponse.json({ 
      success: true, 
      environment: envVars,
      message: 'Environment variables debug info'
    });
    
  } catch (error) {
    console.error('Debug env error:', error);
    return NextResponse.json(
      { error: 'Debug failed' },
      { status: 500 }
    );
  }
}
