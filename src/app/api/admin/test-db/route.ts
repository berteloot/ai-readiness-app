import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { adminAuthMiddleware, getAdminUserFromRequest } from '@/lib/adminAuth';

// Global variable to store Prisma instance
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple instances
  if (!(global as { prisma?: PrismaClient }).prisma) {
    (global as { prisma?: PrismaClient }).prisma = new PrismaClient();
  }
  prisma = (global as { prisma?: PrismaClient }).prisma!;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication first
    const authResult = await adminAuthMiddleware(request);
    if (authResult) {
      return authResult;
    }
    
    // Get admin user info for logging
    const adminUser = getAdminUserFromRequest(request);
    console.log(`Admin ${adminUser?.email} testing database connection`);
    
    console.log('Database test endpoint called');
    
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set',
    };
    
    console.log('Environment check:', envCheck);
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not set',
        env: envCheck
      }, { status: 500 });
    }
    
    // Test database connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Test if tables exist by running a simple query
    console.log('Testing table access...');
    const userCount = await prisma.user.count();
    const submissionCount = await prisma.submission.count();
    
    console.log(`Tables accessible - Users: ${userCount}, Submissions: ${submissionCount}`);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection and tables working',
      env: envCheck,
      tables: {
        users: userCount,
        submissions: submissionCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    
    let errorDetails = 'Unknown error';
    let errorCode = null;
    
    if (error instanceof Error) {
      errorDetails = error.message;
    }
    
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code?: string };
      errorCode = prismaError.code;
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Database test failed',
      error: errorDetails,
      code: errorCode,
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
}
