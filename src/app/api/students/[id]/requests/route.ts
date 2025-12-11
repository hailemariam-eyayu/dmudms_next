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

    // Get all requests and filter by student
    const allRequests = await mongoDataStore.getRequests();
    const studentRequests = allRequests.filter(request => 
      request.student_id === studentId
    );

    return NextResponse.json({
      success: true,
      data: studentRequests
    });

  } catch (error) {
    console.error('Error fetching student requests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    // Students can only create requests for themselves
    if (session.user.role === 'student' && session.user.id !== studentId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, description, priority = 'medium' } = body;

    if (!type || !description) {
      return NextResponse.json(
        { success: false, error: 'Type and description are required' },
        { status: 400 }
      );
    }

    // Get student placement for block/room info
    const placement = await mongoDataStore.getStudentPlacement(studentId);
    
    const requestData = {
      student_id: studentId,
      type,
      description,
      priority,
      status: 'pending',
      block: placement?.block || null,
      room: placement?.room || null,
      created_date: new Date(),
      updated_date: new Date()
    };

    const newRequest = await mongoDataStore.createRequest(requestData);

    return NextResponse.json({
      success: true,
      data: newRequest
    });

  } catch (error) {
    console.error('Error creating student request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}