import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';
import { emailService } from '@/lib/emailService';

// Simple CSV parser function
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      records.push(record);
    }
  }
  
  return records;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate', 'registrar'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    
    // Parse CSV
    let records;
    try {
      records = parseCSV(fileContent);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid CSV format' },
        { status: 400 }
      );
    }

    if (records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'CSV file is empty' },
        { status: 400 }
      );
    }

    // Validate CSV headers
    const expectedHeaders = [
      'student_id',
      'first_name',
      'second_name',
      'last_name',
      'email',
      'gender',
      'batch',
      'disability_status'
    ];

    const actualHeaders = Object.keys(records[0]);
    const missingHeaders = expectedHeaders.filter(header => !actualHeaders.includes(header));
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required columns: ${missingHeaders.join(', ')}. Expected columns: ${expectedHeaders.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Process records
    const results = {
      total: records.length,
      created: 0,
      skipped: 0,
      errors: [] as string[],
      emailsSent: 0
    };

    for (const record of records) {
      try {
        // Validate required fields
        for (const field of expectedHeaders) {
          if (!record[field] || record[field].trim() === '') {
            results.errors.push(`Row with student_id ${record.student_id || 'unknown'}: Missing ${field}`);
            results.skipped++;
            continue;
          }
        }

        // Check if student already exists
        const existingStudent = await mongoDataStore.getStudent(record.student_id);
        if (existingStudent) {
          results.errors.push(`Student ID ${record.student_id} already exists`);
          results.skipped++;
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(record.email)) {
          results.errors.push(`Row with student_id ${record.student_id}: Invalid email format`);
          results.skipped++;
          continue;
        }

        // Validate gender
        if (!['male', 'female'].includes(record.gender.toLowerCase())) {
          results.errors.push(`Row with student_id ${record.student_id}: Gender must be 'male' or 'female'`);
          results.skipped++;
          continue;
        }

        // Validate batch (should be a number)
        if (isNaN(parseInt(record.batch))) {
          results.errors.push(`Row with student_id ${record.student_id}: Batch must be a number`);
          results.skipped++;
          continue;
        }

        // Create student data with auto-generated password
        const generatedPassword = `${record.last_name.trim()}1234abcd#`;
        const studentData = {
          student_id: record.student_id.trim(),
          first_name: record.first_name.trim(),
          second_name: record.second_name.trim(),
          last_name: record.last_name.trim(),
          email: record.email.trim().toLowerCase(),
          gender: record.gender.toLowerCase(),
          batch: record.batch.trim(),
          disability_status: record.disability_status.trim().toLowerCase() === 'yes' ? 'physical' : 'none',
          status: 'active',
          password: generatedPassword
        };

        await mongoDataStore.createStudent(studentData);
        results.created++;

        // Send welcome email with credentials
        try {
          await emailService.sendWelcomeEmail({
            name: `${studentData.first_name} ${studentData.second_name} ${studentData.last_name}`.trim(),
            email: studentData.email,
            userId: studentData.student_id,
            password: generatedPassword,
            loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`,
            userType: 'student'
          });
          results.emailsSent++;
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${studentData.email}:`, emailError);
          // Don't fail the student creation if email fails
        }

      } catch (error: any) {
        console.error('Error creating student:', error);
        results.errors.push(`Row with student_id ${record.student_id || 'unknown'}: ${error.message}`);
        results.skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Upload completed. ${results.created} students created, ${results.skipped} skipped, ${results.emailsSent} welcome emails sent.`
    });

  } catch (error) {
    console.error('Error uploading CSV:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}