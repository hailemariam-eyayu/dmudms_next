import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Request from '@/models/mongoose/Request';
import connectDB from '@/lib/mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, resolved_by } = body;

    // Check permissions based on role
    const allowedRoles = ['admin', 'directorate', 'coordinator', 'maintainer'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const updateData: any = { status };

    if (status === 'approved') {
      updateData.approved_by = session.user.id;
      updateData.approved_date = new Date();
    } else if (status === 'done') {
      updateData.resolved_by = resolved_by || session.user.id;
      updateData.resolved_date = new Date();
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'Request not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedRequest,
      message: `Request ${status} successfully` 
    });

  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update request' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Only admin and directorate can delete requests
    if (!['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json({ 
        success: false, 
        error: 'Request not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Request deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete request' 
    }, { status: 500 });
  }
}