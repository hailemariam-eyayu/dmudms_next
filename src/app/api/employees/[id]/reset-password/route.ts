import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';
import { hashPassword } from '@/lib/auth';

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
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      newPassword: newPassword
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}