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
    
    // Allow users to view their own profile or admins to view any profile
    if (session.user.id !== id && !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const employee = await mongoDataStore.getEmployee(id);
    
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    // Remove password from response
    const { password, ...employeeData } = employee;

    return NextResponse.json({
      success: true,
      data: employeeData
    });
  } catch (error: any) {
    console.error('Error fetching employee:', error);
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
    console.log('🔄 Employee update API called');
    
    const session = await getServerSession(authOptions);
    console.log('📋 Session:', session ? `User: ${session.user.id}, Role: ${session.user.role}` : 'No session');
    
    if (!session) {
      console.log('❌ No session found');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log('🎯 Target employee ID:', id);
    
    // Allow users to update their own profile or admins to update any profile
    if (session.user.id !== id && !['admin', 'directorate'].includes(session.user.role)) {
      console.log('❌ Insufficient permissions');
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const updates = await request.json();
    console.log('📝 Update data received:', JSON.stringify(updates, null, 2));
    
    // Determine allowed updates based on user role and context
    let allowedUpdates: any;
    
    if (session.user.role === 'admin') {
      // Admins can update everything except password and employee_id
      const { password, employee_id, ...adminAllowedUpdates } = updates;
      allowedUpdates = adminAllowedUpdates;
      console.log('👑 Admin update - allowing role and status changes');
    } else if (session.user.id === id) {
      // Users updating their own profile - block sensitive fields
      const { password, employee_id, role, status, ...profileUpdates } = updates;
      allowedUpdates = profileUpdates;
      console.log('👤 Profile update - blocking role and status changes');
    } else {
      // Directorate users updating others - allow most fields but not role
      const { password, employee_id, role, ...directorateUpdates } = updates;
      allowedUpdates = directorateUpdates;
      console.log('🏢 Directorate update - allowing status but not role changes');
    }
    
    console.log('✅ Allowed updates:', JSON.stringify(allowedUpdates, null, 2));

    // Validate role and status if they're being updated by admin
    if (session.user.role === 'admin' && allowedUpdates.role) {
      const validRoles = ['admin', 'directorate', 'coordinator', 'proctor', 'security_guard', 'registrar', 'maintainer'];
      if (!validRoles.includes(allowedUpdates.role)) {
        console.log('❌ Invalid role provided:', allowedUpdates.role);
        return NextResponse.json({ success: false, error: 'Invalid role provided' }, { status: 400 });
      }
    }
    
    if (allowedUpdates.status) {
      const validStatuses = ['active', 'inactive'];
      if (!validStatuses.includes(allowedUpdates.status)) {
        console.log('❌ Invalid status provided:', allowedUpdates.status);
        return NextResponse.json({ success: false, error: 'Invalid status provided' }, { status: 400 });
      }
    }

    console.log('🔄 Calling mongoDataStore.updateEmployee...');
    const updatedEmployee = await mongoDataStore.updateEmployee(id, allowedUpdates);
    console.log('📊 Update result:', updatedEmployee ? 'Success' : 'Employee not found');
    
    if (!updatedEmployee) {
      console.log('❌ Employee not found');
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...employeeData } = updatedEmployee;
    console.log('✅ Returning success response');

    return NextResponse.json({
      success: true,
      data: employeeData,
      message: 'Employee updated successfully'
    });
  } catch (error: any) {
    console.error('❌ Error updating employee:', error);
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // Handle specific MongoDB errors
    if (error.code === 11000 || error.message.includes('duplicate key')) {
      console.log('🔍 Duplicate key error detected');
      
      // Check if it's an email duplicate
      if (error.message.includes('email')) {
        console.log('📧 Email duplicate error');
        return NextResponse.json(
          { success: false, error: 'Email address is already in use by another employee' },
          { status: 400 }
        );
      }
      
      // Generic duplicate key error
      return NextResponse.json(
        { success: false, error: 'This information is already in use by another employee' },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.log('📝 Validation error detected');
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
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
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete employees
    if (session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    
    const deleted = await mongoDataStore.deleteEmployee(id);
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}