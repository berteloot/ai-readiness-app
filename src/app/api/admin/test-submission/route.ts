import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { adminAuthMiddleware, getAdminUserFromRequest } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const authResult = await adminAuthMiddleware(request);
    if (authResult) {
      return authResult;
    }
    
    // Get admin user info for logging
    const adminUser = getAdminUserFromRequest(request);
    console.log(`Admin ${adminUser?.email} creating test data`);
    
    // Create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
      },
    });

    // Create a test submission
    const testSubmission = await prisma.submission.create({
      data: {
        userId: testUser.id,
        company: 'Test Company',
        answers: { test: 'data' },
        score: 75,
        tier: 'GETTING_STARTED',
        aiReport: 'This is a test AI report for demonstration purposes.',
        painPoints: ['Test pain point 1', 'Test pain point 2'],
      },
    });

    console.log(`Admin ${adminUser?.email} successfully created test data`);
    return NextResponse.json({
      message: 'Test data created successfully',
      user: testUser,
      submission: testSubmission,
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      { error: 'Failed to create test data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
