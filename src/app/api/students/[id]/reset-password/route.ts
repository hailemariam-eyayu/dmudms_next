import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';
import { hashPassword } from '@/lib/auth';
import { emailService } from '@/lib/emailService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admin and registrar can reset student passwords
    if (!session || !['admin', 'registrar'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const student = await mongoDataStore.getStudent(id);
    
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Generate new password using Laravel pattern: last_name + "1234abcd#"
    const newPassword = `${student.last_name}1234abcd#`;
    
    // Hash and update the password
    const hashedPassword = hashPassword(newPassword);
    await mongoDataStore.updateStudent(id, { password: hashedPassword });
    
    // Send password reset email
    if (student.email) {
      try {
        await emailService.sendPasswordResetEmail({
          name: `${student.first_name} ${student.second_name} ${student.last_name}`.trim(),
          email: student.email,
          userId: student.student_id,
          password: newPassword,
          loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`,
          userType: 'student' as const
        });
      } catch (error) {
        console.error('Failed to send password reset email:', error);
        // Don't fail the request if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      newPassword: newPassword,
      emailSent: !!student.email
    });
  } catch (error) {
    console.error('Error resetting student password:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}