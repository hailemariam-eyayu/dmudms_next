import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['proctor', 'proctor_manager', 'coordinator'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const proctorId = searchParams.get('proctorId') || session.user.id;

    // Get all blocks
    const allBlocks = await mongoDataStore.getBlocks();
    
    let proctorBlocks;
    
    if (session.user.role === 'coordinator') {
      // Coordinators can see all students or filter by specific proctor
      if (searchParams.get('proctorId')) {
        // Filter by specific proctor
        proctorBlocks = allBlocks.filter(block => block.proctor_id === proctorId);
      } else {
        // Show all blocks with assigned proctors
        proctorBlocks = allBlocks.filter(block => block.proctor_id);
      }
    } else {
      // Proctors can only see their own assigned blocks
      const proctor = await mongoDataStore.getEmployee(proctorId);
      if (!proctor) {
        return NextResponse.json(
          { success: false, error: 'Proctor not found' },
          { status: 404 }
        );
      }
      proctorBlocks = allBlocks.filter(block => block.proctor_id === proctorId);
    }

    if (proctorBlocks.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No blocks assigned to this proctor'
      });
    }

    // Get students placed in the proctor's assigned blocks
    const allPlacements = await mongoDataStore.getStudentPlacements();
    const assignedPlacements = allPlacements.filter(placement =>
      proctorBlocks.some(block => block.block_id === placement.block)
    );

    if (assignedPlacements.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No students assigned to your blocks'
      });
    }

    // Get student details for assigned placements
    const students = await mongoDataStore.getStudents();
    const assignedStudents = assignedPlacements.map(placement => {
      const student = students.find(s => s.student_id === placement.student_id);
      if (!student) return null;
      
      return {
        ...student,
        room: placement.room,
        block: placement.block,
        placement_status: placement.status,
        block_name: proctorBlocks.find(b => b.block_id === placement.block)?.name || placement.block
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: assignedStudents,
      blocks: proctorBlocks.map(block => ({
        block_id: block.block_id,
        name: block.name,
        capacity: block.capacity,
        occupied: block.occupied
      }))
    });

  } catch (error) {
    console.error('Error fetching assigned students:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}