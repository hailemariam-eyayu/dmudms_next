import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate', 'coordinator', 'registrar'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const includePasswords = searchParams.get('includePasswords') === 'true';

    // Get all students
    const students = await mongoDataStore.getStudents();

    if (format === 'csv') {
      // Generate CSV content
      const headers = [
        'student_id',
        'first_name',
        'second_name', 
        'last_name',
        'email',
        'gender',
        'batch',
        'disability_status',
        'status'
      ];

      if (includePasswords && session.user.role === 'admin') {
        headers.push('default_password');
      }

      let csvContent = headers.join(',') + '\n';

      for (const student of students) {
        const row = [
          student.student_id,
          student.first_name,
          student.second_name,
          student.last_name,
          student.email,
          student.gender,
          student.batch,
          student.disability_status,
          student.status
        ];

        if (includePasswords && session.user.role === 'admin') {
          // Generate default password pattern
          row.push(`${student.last_name}1234abcd#`);
        }

        // Escape commas and quotes in CSV
        const escapedRow = row.map(field => {
          const str = String(field || '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });

        csvContent += escapedRow.join(',') + '\n';
      }

      // Return CSV file
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="students_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Return JSON format
    return NextResponse.json({
      success: true,
      data: students,
      count: students.length,
      exported_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error exporting students:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}