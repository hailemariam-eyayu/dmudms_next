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

    // Create emergency data with all possible fields
    const emergencyWithReporter: any = {
      type: emergencyData.type,
      description: emergencyData.description.trim(),
      status: 'reported',
      reported_date: new Date(),
    };

    // Add reporter information based on user role
    if (session.user.role === 'student') {
      // Student reporting their own emergency
      emergencyWithReporter.student_id = session.user.id;
      emergencyWithReporter.reported_by = session.user.id;
      emergencyWithReporter.reporter_type = 'student';
    } else {
      // Staff member reporting emergency (proctor, coordinator, etc.)
      emergencyWithReporter.student_id = emergencyData.student_id || null;
      emergencyWithReporter.reported_by = session.user.id;
      emergencyWithReporter.reporter_type = 'staff';
      emergencyWithReporter.reporter_role = session.user.role;
      emergencyWithReporter.location = emergencyData.location || 'Not specified';
      emergencyWithReporter.severity = emergencyData.severity || 'medium';
    }

    // Add optional emergency contact fields if provided
    if (emergencyData.father_name) emergencyWithReporter.father_name = emergencyData.father_name.trim();
    if (emergencyData.grand_father) emergencyWithReporter.grand_father = emergencyData.grand_father.trim();
    if (emergencyData.grand_grand_father) emergencyWithReporter.grand_grand_father = emergencyData.grand_grand_father.trim();
    if (emergencyData.phone) emergencyWithReporter.phone = emergencyData.phone.trim();
    if (emergencyData.region) emergencyWithReporter.region = emergencyData.region.trim();
    if (emergencyData.woreda) emergencyWithReporter.woreda = emergencyData.woreda.trim();
    if (emergencyData.kebele) emergencyWithReporter.kebele = emergencyData.kebele.trim();
    if (emergencyData.mother_name) emergencyWithReporter.mother_name = emergencyData.mother_name.trim();
    
    console.log('🚨 Creating emergency:', JSON.stringify(emergencyWithReporter, null, 2));

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