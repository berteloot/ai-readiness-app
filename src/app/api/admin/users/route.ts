import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { adminAuthMiddleware, getAdminUserFromRequest } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check authentication first
    const authResult = await adminAuthMiddleware(request);
    if (authResult) {
      return authResult;
    }
    
    // Get admin user info for logging
    const adminUser = getAdminUserFromRequest(request);
    console.log(`Admin ${adminUser?.email} accessed users list`);
    
    // Get all users with their submissions
    const users = await prisma.user.findMany({
      include: {
        submissions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
