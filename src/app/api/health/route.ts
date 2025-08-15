import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'present' : 'missing',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'present' : 'missing',
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'not set',
    DATABASE_URL: process.env.DATABASE_URL ? 'present' : 'missing',
    timestamp: new Date().toISOString(),
  };

  const hasRequiredVars = envStatus.OPENAI_API_KEY === 'present' && 
                          envStatus.SENDGRID_API_KEY === 'present' && 
                          envStatus.SENDGRID_FROM_EMAIL !== 'not set';

  return NextResponse.json({
    status: hasRequiredVars ? 'healthy' : 'unhealthy',
    environment: envStatus,
    message: hasRequiredVars 
      ? 'All required environment variables are present' 
      : 'Missing required environment variables',
  });
}
