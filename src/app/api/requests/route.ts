import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/requests - Get all requests with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const student_id = searchParams.get('student_id');

    let requests = dataStore.getRequests();

    // Apply filters
    if (status) {
      requests = requests.filter(r => r.status === status);
    }

    if (type) {
      requests = requests.filter(r => r.type === type);
    }

    if (student_id) {
      requests = requests.filter(r => r.student_id === student_id);
    }

    // Enrich with student data
    const enrichedRequests = requests.map(request => {
      const student = dataStore.getStudent(request.student_id);
      return {
        ...request,
        student
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedRequests
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

// POST /api/requests - Create a new request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['student_id', 'type', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if student exists
    const student = dataStore.getStudent(body.student_id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    const requestData = {
      student_id: body.student_id,
      type: body.type,
      description: body.description,
      status: 'pending' as const,
      created_date: new Date().toISOString().split('T')[0]
    };

    const newRequest = dataStore.createRequest(requestData);

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: 'Request created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create request' },
      { status: 500 }
    );
  }
}