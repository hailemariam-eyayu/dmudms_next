import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { assignments } = body;

    if (!Array.isArray(assignments)) {
      return NextResponse.json(
        { success: false, error: 'Invalid assignments data' },
        { status: 400 }
      );
    }

    // Update each block with the new proctor assignment
    const updatePromises = assignments.map(async ({ blockId, proctorId }) => {
      return await mongoDataStore.updateBlock(blockId, {
        proctor_id: proctorId,
        updated_at: new Date()
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Proctor assignments updated successfully'
    });

  } catch (error) {
    console.error('Error updating proctor assignments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}