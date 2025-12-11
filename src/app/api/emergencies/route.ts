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
    
    // Add reporter information
    const emergencyWithReporter = {
      ...emergencyData,
      reported_by: session.user.id,
      reported_date: new Date(),
      status: 'reported'
    };

    const result = await mongoDataStore.createEmergency(emergencyWithReporter);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating emergency:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}