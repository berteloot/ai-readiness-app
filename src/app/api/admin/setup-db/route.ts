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

export async function POST(request: NextRequest) {
  try {
    console.log('Database setup endpoint called');
    
    // Check if admin password is provided in request body
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid admin password'
      }, { status: 401 });
    }
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not set'
      }, { status: 500 });
    }
    
    console.log('Setting up database tables...');
    
    // This will create the tables based on your Prisma schema
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`;
    
    // Push the schema to create tables
    const { execSync } = require('child_process');
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      env: process.env 
    });
    
    console.log('Database tables created successfully');
    
    return NextResponse.json({
      status: 'success',
      message: 'Database tables created successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database setup failed:', error);
    
    let errorDetails = 'Unknown error';
    if (error instanceof Error) {
      errorDetails = error.message;
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Database setup failed',
      error: errorDetails,
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
