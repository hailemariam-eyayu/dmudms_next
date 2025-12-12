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
      // Coordinators can see all requests or filter by specific proctor
      if (searchParams.get('proctorId')) {
        // Filter by specific proctor
        proctorBlocks = allBlocks.filter(block => block.proctor_id === proctorId);
      } else {
        // Show all blocks with assigned proctors
        proctorBlocks = allBlocks.filter(block => block.proctor_id);
      }
    } else {
      // Proctors can only see their own assigned blocks
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

    const assignedStudentIds = assignedPlacements.map(p => p.student_id);

    if (assignedStudentIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No students assigned to your blocks'
      });
    }

    // Get all requests and filter for assigned students only
    const allRequests = await mongoDataStore.getRequests();
    const proctorRequests = allRequests.filter(request =>
      assignedStudentIds.includes(request.student_id)
    );

    // Get student details for the requests
    const students = await mongoDataStore.getStudents();
    const requestsWithStudentInfo = proctorRequests.map(request => {
      const student = students.find(s => s.student_id === request.student_id);
      const placement = assignedPlacements.find(p => p.student_id === request.student_id);
      
      return {
        ...request,
        student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
        student_email: student?.email,
        block: placement?.block,
        room: placement?.room,
        block_name: proctorBlocks.find(b => b.block_id === placement?.block)?.name
      };
    });

    // Sort by creation date (newest first)
    requestsWithStudentInfo.sort((a, b) => 
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: requestsWithStudentInfo,
      blocks: proctorBlocks.map(block => ({
        block_id: block.block_id,
        name: block.name
      }))
    });

  } catch (error) {
    console.error('Error fetching proctor requests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}