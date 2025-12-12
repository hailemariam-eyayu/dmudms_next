import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const emergencies = await mongoDataStore.getEmergencies();
    
    return NextResponse.json({
      success: true,
      data: emergencies
    });
  } catch (error: any) {
    console.error('Error fetching emergencies:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let emergencyData: any = null;
  
  try {
    console.log('🚨 Emergency API POST called');
    
    const session = await getServerSession(authOptions);
    console.log('🔐 Session check:', session ? 'Valid' : 'Invalid');
    
    if (!session) {
      console.log('❌ No session found');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📥 Parsing request body...');
    emergencyData = await request.json();
    console.log('📋 Received emergency data:', JSON.stringify(emergencyData, null, 2));
    
    // Validate required fields
    if (!emergencyData.type || !emergencyData.description) {
      return NextResponse.json(
        { success: false, error: 'Type and description are required' },
        { status: 400 }
      );
    }

    // Validate type enum
    const validTypes = ['medical', 'security', 'fire', 'other'];
    if (!validTypes.includes(emergencyData.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid emergency type' },
        { status: 400 }
      );
    }

    // Add reporter information and defaults
    // Use provided student_id or fallback to session user id
    let reporterStudentId = emergencyData.student_id;
    if (!reporterStudentId) {
      // If no student_id provided, use session user id
      // For students, session.user.id should be their student_id
      // For staff reporting on behalf of students, they should provide student_id
      reporterStudentId = session.user.id;
    }
    
    console.log('👤 Reporter student ID:', reporterStudentId);
    
    // Validate that the student exists (optional validation)
    try {
      const student = await mongoDataStore.getStudent(reporterStudentId);
      if (!student) {
        console.log('⚠️ Student not found, but proceeding with emergency creation');
      } else {
        console.log('✅ Student found:', student.first_name, student.last_name);
      }
    } catch (error) {
      console.log('⚠️ Could not validate student, but proceeding with emergency creation');
    }
    
    const emergencyWithReporter = {
      student_id: reporterStudentId,
      type: emergencyData.type,
      description: emergencyData.description.trim(),
      status: 'reported',
      reported_date: new Date(),
      // Optional emergency contact fields - only include if provided
      ...(emergencyData.father_name && { father_name: emergencyData.father_name.trim() }),
      ...(emergencyData.grand_father && { grand_father: emergencyData.grand_father.trim() }),
      ...(emergencyData.grand_grand_father && { grand_grand_father: emergencyData.grand_grand_father.trim() }),
      ...(emergencyData.phone && { phone: emergencyData.phone.trim() }),
      ...(emergencyData.region && { region: emergencyData.region.trim() }),
      ...(emergencyData.woreda && { woreda: emergencyData.woreda.trim() }),
      ...(emergencyData.kebele && { kebele: emergencyData.kebele.trim() }),
      ...(emergencyData.mother_name && { mother_name: emergencyData.mother_name.trim() })
    };

    console.log('🔄 Processed emergency data:', JSON.stringify(emergencyWithReporter, null, 2));

    console.log('💾 Calling mongoDataStore.createEmergency...');
    const result = await mongoDataStore.createEmergency(emergencyWithReporter);
    console.log('✅ Emergency created successfully:', result._id);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Emergency reported successfully'
    });
  } catch (error: any) {
    console.error('Error creating emergency:', error);
    console.error('Original emergency data:', emergencyData);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Internal server error: ${error?.message || 'Unknown error'}`,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}