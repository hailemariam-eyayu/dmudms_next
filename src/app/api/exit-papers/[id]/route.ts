import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ExitPaper from '@/models/mongoose/ExitPaper';
import mongoDataStore from '@/lib/mongoDataStore';

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
    await mongoDataStore.init();

    const exitPaper = await ExitPaper.findById(id).lean();
    
    if (!exitPaper) {
      return NextResponse.json({ success: false, error: 'Exit paper not found' }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === 'student' && exitPaper.student_id !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (session.user.role === 'security_guard' && exitPaper.status !== 'approved') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: exitPaper
    });
  } catch (error) {
    console.error('Error fetching exit paper:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['proctor', 'coordinator', 'admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Only proctors and above can approve exit papers' }, { status: 401 });
    }

    const { id } = await params;
    const { action, rejection_reason } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    if (action === 'reject' && !rejection_reason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required when rejecting' },
        { status: 400 }
      );
    }

    await mongoDataStore.init();

    const exitPaper = await ExitPaper.findById(id);
    
    if (!exitPaper) {
      return NextResponse.json({ success: false, error: 'Exit paper not found' }, { status: 404 });
    }

    if (exitPaper.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Exit paper has already been processed' },
        { status: 400 }
      );
    }

    // Update exit paper
    exitPaper.status = action === 'approve' ? 'approved' : 'rejected';
    exitPaper.approved_by = session.user.id;
    exitPaper.approved_by_name = session.user.name;
    exitPaper.approved_at = new Date();
    
    if (action === 'reject') {
      exitPaper.rejection_reason = rejection_reason;
    }

    await exitPaper.save();

    return NextResponse.json({
      success: true,
      data: exitPaper,
      message: `Exit paper ${action}d successfully`
    });
  } catch (error) {
    console.error('Error updating exit paper:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
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
    await mongoDataStore.init();

    const exitPaper = await ExitPaper.findById(id);
    
    if (!exitPaper) {
      return NextResponse.json({ success: false, error: 'Exit paper not found' }, { status: 404 });
    }

    // Students can only delete their own pending exit papers
    if (session.user.role === 'student') {
      if (exitPaper.student_id !== session.user.id) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
      if (exitPaper.status !== 'pending') {
        return NextResponse.json(
          { success: false, error: 'Cannot delete processed exit papers' },
          { status: 400 }
        );
      }
    } else if (!['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    await ExitPaper.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Exit paper deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exit paper:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}