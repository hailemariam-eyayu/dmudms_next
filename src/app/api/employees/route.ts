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

    // Only admin and directorate can view all employees
    if (!['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const employees = await mongoDataStore.getEmployees();
    
    return NextResponse.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
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

    const employeeData = await request.json();
    
    // Validate required fields
    const requiredFields = ['employee_id', 'first_name', 'last_name', 'email', 'gender', 'role'];
    for (const field of requiredFields) {
      if (!employeeData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate a secure default password if not provided (matching Laravel pattern)
    let generatedPassword = null;
    if (!employeeData.password) {
      // Generate password using Laravel pattern: last_name + "1234abcd#"
      generatedPassword = `${employeeData.last_name}1234abcd#`;
      employeeData.password = generatedPassword;
    }

    const result = await mongoDataStore.createEmployee(employeeData);
    
    // Send welcome email with credentials
    if (generatedPassword && employeeData.email) {
      try {
        await emailService.sendWelcomeEmail({
          name: `${employeeData.first_name} ${employeeData.last_name}`,
          email: employeeData.email,
          userId: employeeData.employee_id,
          password: generatedPassword,
          loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`,
          userType: 'employee'
        });
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't fail the request if email fails
      }
    }
    
    // Return the result with the generated password (for admin to share with employee)
    const response = {
      success: true,
      data: result,
      ...(generatedPassword && { generatedPassword }),
      emailSent: !!generatedPassword && !!employeeData.email
    };
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error creating employee:', error);
    
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