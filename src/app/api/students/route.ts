import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';
import { emailService } from '@/lib/emailService';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and directorate can view all students
    if (!['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const students = await mongoDataStore.getStudents();
    
    return NextResponse.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const studentData = await request.json();
    
    // Validate required fields
    const requiredFields = ['student_id', 'first_name', 'last_name', 'email'];
    for (const field of requiredFields) {
      if (!studentData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set default password if not provided (matching Laravel pattern)
    let generatedPassword = null;
    if (!studentData.password) {
      generatedPassword = `${studentData.last_name}1234abcd#`;
      studentData.password = generatedPassword;
    }

    const result = await mongoDataStore.createStudent(studentData);
    
    // Send welcome email with credentials
    if (generatedPassword && studentData.email) {
      try {
        await emailService.sendWelcomeEmail({
          name: `${studentData.first_name} ${studentData.second_name} ${studentData.last_name}`.trim(),
          email: studentData.email,
          userId: studentData.student_id,
          password: generatedPassword,
          loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`,
          userType: 'student'
        });
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't fail the request if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      ...(generatedPassword && { generatedPassword }),
      emailSent: !!generatedPassword && !!studentData.email
    });
  } catch (error: any) {
    console.error('Error creating student:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return NextResponse.json(
        { success: false, error: `${field} '${value}' already exists. Please use a different ${field}.` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}