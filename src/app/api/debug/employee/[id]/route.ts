import { NextRequest, NextResponse } from 'next/server';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get employee data (including password field for debugging)
    const employee = await mongoDataStore.getEmployee(id);
    
    if (!employee) {
      return NextResponse.json({
        success: false,
        error: 'Employee not found',
        employeeId: id
      });
    }

    // Return employee data without password for security
    const { password, ...employeeData } = employee;
    
    return NextResponse.json({
      success: true,
      data: {
        ...employeeData,
        hasPassword: !!password,
        passwordLength: password ? password.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}