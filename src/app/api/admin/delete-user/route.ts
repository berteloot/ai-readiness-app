import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

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
