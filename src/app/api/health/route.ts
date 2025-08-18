import { NextResponse } from 'next/server';

export async function GET() {
  // SECURITY: Only check if required environment variables exist, don't reveal their values
  const hasRequiredVars = !!(
    process.env.OPENAI_API_KEY && 
    process.env.SENDGRID_API_KEY && 
    process.env.SENDGRID_FROM_EMAIL
  );

  // SECURITY: Don't leak environment details, only return minimal health status
  return NextResponse.json({
    status: hasRequiredVars ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    // SECURITY: Don't reveal which specific variables are missing
    message: hasRequiredVars 
      ? 'Service is operational' 
      : 'Service configuration incomplete',
  });
}
