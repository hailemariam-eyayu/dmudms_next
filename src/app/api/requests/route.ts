import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Request from '@/models/mongoose/Request';
import connectDB from '@/lib/mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let query = {};
    const { searchParams } = new URL(request.url);
    const role = session.user.role;
    const userId = session.user.id;

    // Role-based filtering
    if (role === 'student') {
      query = { student_id: userId };
    } else if (role === 'maintainer') {
      // Maintainer sees maintenance requests
      query = { 
        type: 'maintenance',
        status: { $in: ['approved', 'done'] }
      };
    } else if (role === 'coordinator') {
      // Coordinator sees replacement and room change requests
      query = { 
        type: { $in: ['replacement', 'room_change'] },
        status: { $in: ['pending', 'approved'] }
      };
    } else if (role === 'admin' || role === 'directorate') {
      // Admin and directorate see all requests
      const status = searchParams.get('status');
      const type = searchParams.get('type');
      
      if (status) query = { ...query, status };
      if (type) query = { ...query, type };
    } else {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const requests = await Request.find(query)
      .sort({ created_date: -1 })
      .limit(100);

    return NextResponse.json({ 
      success: true, 
      data: requests 
    });

  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch requests' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { type, category, priority, description } = body;

    // Validate required fields
    if (!type || !category || !priority || !description) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create new request
    const newRequest = new Request({
      student_id: session.user.id,
      type,
      category,
      priority,
      description: description.trim(),
      status: 'pending',
      created_date: new Date()
    });

    await newRequest.save();

    return NextResponse.json({ 
      success: true, 
      data: newRequest,
      message: 'Request submitted successfully' 
    });

  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create request' 
    }, { status: 500 });
  }
}