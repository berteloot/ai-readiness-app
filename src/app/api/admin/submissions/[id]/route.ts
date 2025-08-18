import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { adminAuthMiddleware, getAdminUserFromRequest } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication first
    const authResult = await adminAuthMiddleware(request);
    if (authResult) {
      return authResult;
    }
    
    // Get admin user info for logging
    const adminUser = getAdminUserFromRequest(request);
    
    const { id } = await params;

    if (!id) {
      console.log(`Admin ${adminUser?.email} attempted to delete submission without providing ID`);
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Log the deletion attempt
    console.log(`Admin ${adminUser?.email} attempting to delete submission ${id}`);

    // Delete the submission
    await prisma.submission.delete({
      where: {
        id: id
      }
    });

    console.log(`Admin ${adminUser?.email} successfully deleted submission ${id}`);
    return NextResponse.json(
      { message: 'Submission deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
