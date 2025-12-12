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
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const emergencyData = await request.json();
    
    // Validate required fields
    if (!emergencyData.type || !emergencyData.description) {
      return NextResponse.json(
        { success: false, error: 'Type and description are required' },
        { status: 400 }
      );
    }

    // Add reporter information and defaults
    const emergencyWithReporter = {
      student_id: emergencyData.student_id || session.user.id,
      type: emergencyData.type,
      description: emergencyData.description,
      status: 'reported',
      reported_date: new Date(),
      // Optional emergency contact fields
      father_name: emergencyData.father_name || '',
      grand_father: emergencyData.grand_father || '',
      grand_grand_father: emergencyData.grand_grand_father || '',
      phone: emergencyData.phone || '',
      region: emergencyData.region || '',
      woreda: emergencyData.woreda || '',
      kebele: emergencyData.kebele || '',
      mother_name: emergencyData.mother_name || ''
    };

    const result = await mongoDataStore.createEmergency(emergencyWithReporter);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Emergency reported successfully'
    });
  } catch (error) {
    console.error('Error creating emergency:', error);
    console.error('Emergency data:', emergencyData);
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}