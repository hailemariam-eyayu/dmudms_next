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
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const employee = await mongoDataStore.getEmployeeById(id);
    
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    // Generate a new password using Laravel pattern: last_name + "1234abcd#"
    const newPassword = `${employee.last_name}1234abcd#`;
    
    // Hash and update the password
    const hashedPassword = hashPassword(newPassword);
    await mongoDataStore.updateEmployee(id, { password: hashedPassword });
    
    // Send password reset email
    if (employee.email) {
      try {
        await emailService.sendPasswordResetEmail({
          name: `${employee.first_name} ${employee.last_name}`,
          userId: employee.employee_id,
          password: newPassword,
          loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`,
          userType: 'employee'
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
      emailSent: !!employee.email
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}