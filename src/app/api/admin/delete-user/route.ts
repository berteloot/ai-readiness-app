import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { adminAuthMiddleware, getAdminUserFromRequest } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication first
    const authResult = await adminAuthMiddleware(request);
    if (authResult) {
      return authResult;
    }
    
    // Get admin user info for logging
    const adminUser = getAdminUserFromRequest(request);
    
    const { userId } = await request.json();

    if (!userId) {
      console.log(`Admin ${adminUser?.email} attempted to delete user without providing userId`);
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Log the deletion attempt
    console.log(`Admin ${adminUser?.email} attempting to delete user ${userId}`);

    // Delete all submissions for the user first (due to foreign key constraints)
    await prisma.submission.deleteMany({
      where: {
        userId: userId
      }
    });

    // Then delete the user
    await prisma.user.delete({
      where: {
        id: userId
      }
    });

    console.log(`Admin ${adminUser?.email} successfully deleted user ${userId}`);
    return NextResponse.json(
      { message: 'User and all associated submissions deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
