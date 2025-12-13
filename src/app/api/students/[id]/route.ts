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
    // Check if it looks like a MongoDB ObjectId (24 hex characters) and try that first
    let student;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isMongoId) {
      // Try MongoDB _id first
      student = await mongoDataStore.getStudentById(id);
      if (!student) {
        // Fallback to student_id
        student = await mongoDataStore.getStudent(id);
      }
    } else {
      // Try student_id first
      student = await mongoDataStore.getStudent(id);
      if (!student) {
        // Fallback to MongoDB _id
        student = await mongoDataStore.getStudentById(id);
      }
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
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    const { id } = await params;
    
    console.log('🔍 DEBUG: Student update request:', {
      id: id,
      updateDataKeys: Object.keys(updateData),
      userRole: session.user.role,
      userId: session.user.id
    });
    
    // Remove password from update data to prevent accidental password clearing
    // Password should only be updated through dedicated password reset endpoints
    const { password, ...safeUpdateData } = updateData;
    
    // The id parameter could be either MongoDB _id or student_id
    // Check if it looks like a MongoDB ObjectId (24 hex characters) and try that first
    let result;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isMongoId) {
      console.log('🔍 DEBUG: ID looks like MongoDB ObjectId, trying updateStudentById first:', id);
      try {
        result = await mongoDataStore.updateStudentById(id, safeUpdateData);
        console.log('✅ DEBUG: Update by MongoDB _id successful:', !!result);
      } catch (error) {
        console.log('❌ DEBUG: Update by MongoDB _id failed, trying by student_id');
        try {
          result = await mongoDataStore.updateStudent(id, safeUpdateData);
          console.log('✅ DEBUG: Update by student_id successful:', !!result);
        } catch (secondError) {
          console.error('❌ DEBUG: Both update methods failed:', {
            firstError: error instanceof Error ? error.message : 'Unknown error',
            secondError: secondError instanceof Error ? secondError.message : 'Unknown error'
          });
        }
      }
    } else {
      console.log('🔍 DEBUG: ID looks like student_id, trying updateStudent first:', id);
      try {
        result = await mongoDataStore.updateStudent(id, safeUpdateData);
        console.log('✅ DEBUG: Update by student_id successful:', !!result);
      } catch (error) {
        console.log('❌ DEBUG: Update by student_id failed, trying by MongoDB _id');
        try {
          result = await mongoDataStore.updateStudentById(id, safeUpdateData);
          console.log('✅ DEBUG: Update by MongoDB _id successful:', !!result);
        } catch (secondError) {
          console.error('❌ DEBUG: Both update methods failed:', {
            firstError: error instanceof Error ? error.message : 'Unknown error',
            secondError: secondError instanceof Error ? secondError.message : 'Unknown error'
          });
        }
      }
    }
    
    if (!result) {
      console.log('❌ DEBUG: No result from update operations');
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
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // The id parameter could be either MongoDB _id or student_id
    // Check if it looks like a MongoDB ObjectId (24 hex characters) and try that first
    let result;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isMongoId) {
      try {
        result = await mongoDataStore.deleteStudentById(id);
      } catch (error) {
        result = await mongoDataStore.deleteStudent(id);
      }
    } else {
      try {
        result = await mongoDataStore.deleteStudent(id);
      } catch (error) {
        result = await mongoDataStore.deleteStudentById(id);
      }
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