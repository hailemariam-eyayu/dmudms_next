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
      // Coordinators can see all emergencies or filter by specific proctor
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

    // Get all emergencies and filter for relevant ones
    const allEmergencies = await mongoDataStore.getEmergencies();
    
    let proctorEmergencies;
    
    if (session.user.role === 'coordinator') {
      // Coordinators can see all emergencies or filter by specific proctor
      if (searchParams.get('proctorId')) {
        // Filter by specific proctor's blocks
        proctorEmergencies = allEmergencies.filter(emergency => {
          // Include student emergencies from assigned blocks
          if (emergency.student_id && assignedStudentIds.includes(emergency.student_id)) {
            return true;
          }
          // Include staff emergencies reported by this proctor
          if (emergency.reporter_type === 'staff' && emergency.reported_by === proctorId) {
            return true;
          }
          return false;
        });
      } else {
        // Show all emergencies for coordinators
        proctorEmergencies = allEmergencies;
      }
    } else {
      // Proctors see emergencies from their assigned students + their own reports
      proctorEmergencies = allEmergencies.filter(emergency => {
        // Include student emergencies from assigned blocks
        if (emergency.student_id && assignedStudentIds.includes(emergency.student_id)) {
          return true;
        }
        // Include staff emergencies reported by this proctor
        if (emergency.reporter_type === 'staff' && emergency.reported_by === proctorId) {
          return true;
        }
        return false;
      });
    }

    // Get student details for the emergencies
    const students = await mongoDataStore.getStudents();
    const employees = await mongoDataStore.getEmployees();
    
    const emergenciesWithInfo = proctorEmergencies.map(emergency => {
      let studentInfo = null;
      let reporterInfo = null;
      let locationInfo = null;

      // Get student info if emergency is linked to a student
      if (emergency.student_id) {
        const student = students.find(s => s.student_id === emergency.student_id);
        const placement = assignedPlacements.find(p => p.student_id === emergency.student_id);
        
        if (student) {
          studentInfo = {
            student_name: `${student.first_name} ${student.last_name}`,
            student_email: student.email,
            block: placement?.block,
            room: placement?.room,
            block_name: proctorBlocks.find(b => b.block_id === placement?.block)?.name
          };
        }
      }

      // Get reporter info
      if (emergency.reporter_type === 'staff') {
        const reporter = employees.find(e => e.employee_id === emergency.reported_by);
        if (reporter) {
          reporterInfo = {
            reporter_name: `${reporter.first_name} ${reporter.last_name}`,
            reporter_role: emergency.reporter_role || reporter.role
          };
        }
      } else if (emergency.reporter_type === 'student') {
        const reporter = students.find(s => s.student_id === emergency.reported_by);
        if (reporter) {
          reporterInfo = {
            reporter_name: `${reporter.first_name} ${reporter.last_name}`,
            reporter_role: 'student'
          };
        }
      }

      return {
        ...emergency,
        ...studentInfo,
        ...reporterInfo,
        location: emergency.location || 'Not specified',
        severity: emergency.severity || 'medium'
      };
    });

    // Sort by report date (newest first)
    emergenciesWithInfo.sort((a, b) => 
      new Date(b.reported_date).getTime() - new Date(a.reported_date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: emergenciesWithInfo,
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