import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Request from '@/models/mongoose/Request';
import connectDB from '@/lib/mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Students can only see their own requests, others can see any student's requests
    if (session.user.role === 'student' && session.user.id !== id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const requests = await Request.find({ student_id: id })
      .sort({ created_date: -1 });

    return NextResponse.json({ 
      success: true, 
      data: requests 
    });

  } catch (error) {
    console.error('Error fetching student requests:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch requests' 
    }, { status: 500 });
  }
}