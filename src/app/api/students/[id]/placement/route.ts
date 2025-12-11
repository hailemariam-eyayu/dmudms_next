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

    // Get student placement
    const placement = await mongoDataStore.getStudentPlacement(studentId);
    
    if (!placement) {
      return NextResponse.json({
        success: true,
        data: null
      });
    }

    // Get additional placement details
    const [student, block, room] = await Promise.all([
      mongoDataStore.getStudent(studentId),
      mongoDataStore.getBlock(placement.block),
      mongoDataStore.getRoom(placement.room, placement.block)
    ]);

    // Get proctor information
    let proctorName = null;
    if (block?.proctor_id) {
      const proctor = await mongoDataStore.getEmployee(block.proctor_id);
      if (proctor) {
        proctorName = `${proctor.first_name} ${proctor.last_name}`;
      }
    }

    const placementDetails = {
      ...placement,
      student_name: student ? `${student.first_name} ${student.last_name}` : null,
      block_name: block?.name || placement.block,
      room_capacity: room?.capacity || null,
      room_occupancy: room?.current_occupancy || null,
      proctor_name: proctorName,
      emergency_contact: student?.emergency_contact || null
    };

    return NextResponse.json({
      success: true,
      data: placementDetails
    });

  } catch (error) {
    console.error('Error fetching student placement:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}