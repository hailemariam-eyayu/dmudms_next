import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'proctor') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const proctorId = searchParams.get('proctorId') || session.user.id;

    // Get proctor's assigned blocks
    const proctor = await mongoDataStore.getEmployee(proctorId);
    if (!proctor) {
      return NextResponse.json(
        { success: false, error: 'Proctor not found' },
        { status: 404 }
      );
    }

    // For now, we'll assume proctors are assigned to blocks based on their employee_id
    // In a real system, you'd have a proctor_assignments table
    const assignedBlocks = await mongoDataStore.getBlocks();
    const proctorBlocks = assignedBlocks.filter(block => 
      block.proctor_id === proctorId || block.block_id.includes(proctorId.slice(-1))
    );

    if (proctorBlocks.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get students in assigned blocks
    const allPlacements = await mongoDataStore.getStudentPlacements();
    const assignedPlacements = allPlacements.filter(placement =>
      proctorBlocks.some(block => block.block_id === placement.block)
    );

    // Get student details
    const students = await mongoDataStore.getStudents();
    const assignedStudents = assignedPlacements.map(placement => {
      const student = students.find(s => s.student_id === placement.student_id);
      return {
        ...student,
        room: placement.room,
        block: placement.block,
        placement_status: placement.status
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: assignedStudents
    });

  } catch (error) {
    console.error('Error fetching assigned students:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}