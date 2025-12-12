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
    const allowedRoles = ['admin', 'directorate', 'coordinator', 'maintainer', 'proctor', 'proctor_manager'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // For proctors, verify they can only update requests from their assigned students
    if (session.user.role === 'proctor') {
      const mongoDataStore = (await import('@/lib/mongoDataStore')).default;
      
      // Get proctor's assigned blocks
      const allBlocks = await mongoDataStore.getBlocks();
      const proctorBlocks = allBlocks.filter(block => 
        block.proctor_id === session.user.id
      );

      if (proctorBlocks.length === 0) {
        return NextResponse.json({ success: false, error: 'No blocks assigned to this proctor' }, { status: 403 });
      }

      // Get students in assigned blocks
      const allPlacements = await mongoDataStore.getStudentPlacements();
      const assignedPlacements = allPlacements.filter(placement =>
        proctorBlocks.some(block => block.block_id === placement.block)
      );
      const assignedStudentIds = assignedPlacements.map(p => p.student_id);

      // Get the request to check if it's from an assigned student
      const requestToUpdate = await Request.findById(id);
      if (!requestToUpdate) {
        return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
      }

      if (!assignedStudentIds.includes(requestToUpdate.student_id)) {
        return NextResponse.json({ success: false, error: 'You can only update requests from your assigned students' }, { status: 403 });
      }
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