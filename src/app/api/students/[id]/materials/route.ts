import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: studentId } = await params;

    // Students can only access their own data, others need appropriate permissions
    if (session.user.role === 'student' && session.user.id !== studentId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get student placement to determine their block
    const placement = await mongoDataStore.getStudentPlacement(studentId);
    
    if (!placement) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get materials available in the student's block
    const materials = await mongoDataStore.getMaterialsByBlock(placement.block);

    return NextResponse.json({
      success: true,
      data: materials
    });

  } catch (error) {
    console.error('Error fetching student materials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}