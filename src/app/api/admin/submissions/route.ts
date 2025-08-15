import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Global variable to store Prisma instance
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple instances
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Admin submissions API called');
    
    // Get admin password from environment variable to verify access
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      return NextResponse.json(
        { error: 'Admin access not configured' },
        { status: 500 }
      );
    }
    
    console.log('Admin password check passed');

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable not set');
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL environment variable.' },
        { status: 500 }
      );
    }
    
    console.log('DATABASE_URL check passed');

    // Test database connection
    try {
      console.log('Attempting database connection...');
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL and ensure the database is accessible.' },
        { status: 500 }
      );
    }

    // Fetch all submissions with user data
    console.log('Fetching submissions from database...');
    const submissions = await prisma.submission.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Successfully fetched ${submissions.length} submissions`);
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a Prisma-specific error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma error code:', (error as any).code);
      console.error('Prisma error meta:', (error as any).meta);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch submissions', 
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check that your database is running and accessible',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
}
