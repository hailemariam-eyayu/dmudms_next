import { NextRequest, NextResponse } from 'next/server';
import unifiedDataStore from '@/lib/unifiedDataStore';
import { Student } from '@/types';

// GET /api/students - Get all students with optional search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let students = await unifiedDataStore.getStudents();

    // Apply search filter
    if (search) {
      students = await unifiedDataStore.searchStudents(search);
    }

    // Apply status filter
    if (status && status !== 'all') {
      students = students.filter(student => student.status === status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = students.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedStudents,
      pagination: {
        page,
        limit,
        total: students.length,
        totalPages: Math.ceil(students.length / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['student_id', 'first_name', 'last_name', 'email', 'gender', 'batch'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if student ID already exists
    const existingStudent = await unifiedDataStore.getStudent(body.student_id);
    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student ID already exists' },
        { status: 409 }
      );
    }

    // Create student
    const studentData: Omit<Student, 'password'> = {
      student_id: body.student_id,
      first_name: body.first_name,
      second_name: body.second_name || '',
      last_name: body.last_name,
      email: body.email,
      gender: body.gender,
      batch: body.batch,
      disability_status: body.disability_status || 'none',
      status: body.status || 'active'
    };

    const newStudent = await unifiedDataStore.createStudent(studentData);

    return NextResponse.json({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

// PUT /api/students - Bulk operations
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'activate_all') {
      const count = await unifiedDataStore.activateAllStudents();
      return NextResponse.json({
        success: true,
        message: `${count} students activated successfully`
      });
    }

    if (action === 'deactivate_all') {
      const count = await unifiedDataStore.deactivateAllStudents();
      return NextResponse.json({
        success: true,
        message: `${count} students deactivated successfully`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}