import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['proctor', 'proctor_manager'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const proctorId = session.user.id;

    // Get proctor's assigned blocks
    const allBlocks = await mongoDataStore.getBlocks();
    const proctorBlocks = allBlocks.filter(block => 
      block.proctor_id === proctorId
    );

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

    const assignedStudentIds = assignedPlacements.map(p => p.student_id);

    if (assignedStudentIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No students assigned to your blocks'
      });
    }

    // Get all emergencies and filter for assigned students only
    const allEmergencies = await mongoDataStore.getEmergencies();
    const proctorEmergencies = allEmergencies.filter(emergency =>
      assignedStudentIds.includes(emergency.student_id)
    );

    // Get student details for the emergencies
    const students = await mongoDataStore.getStudents();
    const emergenciesWithStudentInfo = proctorEmergencies.map(emergency => {
      const student = students.find(s => s.student_id === emergency.student_id);
      const placement = assignedPlacements.find(p => p.student_id === emergency.student_id);
      
      return {
        ...emergency,
        student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
        student_email: student?.email,
        block: placement?.block,
        room: placement?.room,
        block_name: proctorBlocks.find(b => b.block_id === placement?.block)?.name
      };
    });

    // Sort by report date (newest first)
    emergenciesWithStudentInfo.sort((a, b) => 
      new Date(b.reported_date).getTime() - new Date(a.reported_date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: emergenciesWithStudentInfo,
      blocks: proctorBlocks.map(block => ({
        block_id: block.block_id,
        name: block.name
      }))
    });

  } catch (error) {
    console.error('Error fetching proctor emergencies:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}