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
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      newPassword: newPassword
    });
  } catch (error) {
    console.error('Error resetting student password:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}