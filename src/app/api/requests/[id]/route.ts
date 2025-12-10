import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/requests/[id] - Get a specific request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestData = dataStore.getRequest(parseInt(params.id));
    
    if (!requestData) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    // Enrich with student data
    const student = dataStore.getStudent(requestData.student_id);

    return NextResponse.json({
      success: true,
      data: {
        ...requestData,
        student
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

// PUT /api/requests/[id] - Update a specific request
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'approve') {
      const updatedRequest = dataStore.updateRequest(parseInt(params.id), {
        status: 'approved',
        resolved_date: new Date().toISOString().split('T')[0],
        resolved_by: body.resolved_by || 'system'
      });

      if (!updatedRequest) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedRequest,
        message: 'Request approved successfully'
      });
    }

    if (action === 'reject') {
      const updatedRequest = dataStore.updateRequest(parseInt(params.id), {
        status: 'rejected',
        resolved_date: new Date().toISOString().split('T')[0],
        resolved_by: body.resolved_by || 'system'
      });

      if (!updatedRequest) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedRequest,
        message: 'Request rejected successfully'
      });
    }

    if (action === 'complete') {
      const updatedRequest = dataStore.updateRequest(parseInt(params.id), {
        status: 'completed',
        resolved_date: new Date().toISOString().split('T')[0],
        resolved_by: body.resolved_by || 'system'
      });

      if (!updatedRequest) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedRequest,
        message: 'Request completed successfully'
      });
    }

    // Regular update
    const updatedRequest = dataStore.updateRequest(parseInt(params.id), body);
    
    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: 'Request updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    );
  }
}

// DELETE /api/requests/[id] - Delete a specific request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = dataStore.deleteRequest(parseInt(params.id));
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}