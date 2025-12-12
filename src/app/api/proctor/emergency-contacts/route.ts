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

    // Get students and their emergency contacts
    const students = await mongoDataStore.getStudents();
    const emergencyContacts = await mongoDataStore.getEmergencyContacts();

    const assignedStudentsWithContacts = assignedStudentIds.map(studentId => {
      const student = students.find(s => s.student_id === studentId);
      const placement = assignedPlacements.find(p => p.student_id === studentId);
      const emergencyContact = emergencyContacts.find((ec: any) => ec.student_id === studentId);
      
      if (!student) return null;

      return {
        student_id: student.student_id,
        student_name: `${student.first_name} ${student.second_name || ''} ${student.last_name}`.trim(),
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        status: student.status,
        block: placement?.block,
        room: placement?.room,
        block_name: proctorBlocks.find(b => b.block_id === placement?.block)?.name,
        emergency_contact: emergencyContact ? {
          father_name: emergencyContact.father_name,
          grand_father: emergencyContact.grand_father,
          grand_grand_father: emergencyContact.grand_grand_father,
          mother_name: emergencyContact.mother_name,
          phone: emergencyContact.phone,
          region: emergencyContact.region,
          woreda: emergencyContact.woreda,
          kebele: emergencyContact.kebele,
          created_at: emergencyContact.created_at,
          updated_at: emergencyContact.updated_at
        } : null
      };
    }).filter(Boolean);

    // Sort by block and room
    assignedStudentsWithContacts.sort((a: any, b: any) => {
      if (a.block !== b.block) {
        return a.block.localeCompare(b.block);
      }
      return a.room.localeCompare(b.room);
    });

    return NextResponse.json({
      success: true,
      data: assignedStudentsWithContacts,
      blocks: proctorBlocks.map(block => ({
        block_id: block.block_id,
        name: block.name,
        capacity: block.capacity,
        occupied: block.occupied
      }))
    });

  } catch (error) {
    console.error('Error fetching proctor emergency contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}