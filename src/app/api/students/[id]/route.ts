import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/students/[id] - Get a specific student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = dataStore.getStudent(params.id);
    
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Get student placement if exists
    const placement = dataStore.getStudentPlacement(params.id);

    return NextResponse.json({
      success: true,
      data: {
        ...student,
        placement
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Update a specific student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedStudent = dataStore.updateStudent(params.id, body);
    
    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Delete a specific student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = dataStore.deleteStudent(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}