import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const includePasswords = searchParams.get('includePasswords') === 'true';

    // Get all employees
    const employees = await mongoDataStore.getEmployees();

    if (format === 'csv') {
      // Generate CSV content
      const headers = [
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'gender',
        'phone',
        'department',
        'role',
        'status'
      ];

      if (includePasswords && session.user.role === 'admin') {
        headers.push('default_password');
      }

      let csvContent = headers.join(',') + '\n';

      for (const employee of employees) {
        const row = [
          employee.employee_id,
          employee.first_name,
          employee.last_name,
          employee.email,
          employee.gender || '',
          employee.phone || '',
          employee.department || '',
          employee.role,
          employee.status
        ];

        if (includePasswords && session.user.role === 'admin') {
          // Generate default password pattern
          row.push(`${employee.last_name}1234abcd#`);
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
          'Content-Disposition': `attachment; filename="employees_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Return JSON format
    return NextResponse.json({
      success: true,
      data: employees,
      count: employees.length,
      exported_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error exporting employees:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}