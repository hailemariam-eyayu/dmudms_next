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
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // The id parameter could be either MongoDB _id or student_id
    // First try to find by student_id, then by MongoDB _id
    let student = await mongoDataStore.getStudent(id);
    
    if (!student) {
      // Try to find by MongoDB _id
      student = await mongoDataStore.getStudentById(id);
    }
    
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
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
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    const { id } = await params;
    
    // Remove password from update data to prevent accidental password clearing
    // Password should only be updated through dedicated password reset endpoints
    const { password, ...safeUpdateData } = updateData;
    
    // The id parameter could be either MongoDB _id or student_id
    // First try to find by student_id, then by MongoDB _id
    let result;
    try {
      result = await mongoDataStore.updateStudent(id, safeUpdateData);
    } catch (error) {
      // If that fails, try updating by MongoDB _id
      result = await mongoDataStore.updateStudentById(id, safeUpdateData);
    }
    
    if (!result) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating student:', error);
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
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // The id parameter could be either MongoDB _id or student_id
    // First try to delete by student_id, then by MongoDB _id
    let result;
    try {
      result = await mongoDataStore.deleteStudent(id);
    } catch (error) {
      // If that fails, try deleting by MongoDB _id
      result = await mongoDataStore.deleteStudentById(id);
    }
    
    if (!result) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}