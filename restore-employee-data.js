const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function restoreEmployeeData() {
  try {
    console.log('🔄 Starting employee data restoration...');

    // Hash the password 'password' for all employees
    const hashedPassword = await bcrypt.hash('password', 12);

    // Employee data from the login page
    const employees = [
      {
        employee_id: 'Employee1',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@dormitory.edu',
        role: 'ADMIN',
        password: hashedPassword
      },
      {
        employee_id: 'Employee2',
        first_name: 'Coordinator',
        last_name: 'Two',
        email: 'coordinator2@dormitory.edu',
        role: 'COORDINATOR',
        password: hashedPassword
      },
      {
        employee_id: 'Employee3',
        first_name: 'Directorate',
        last_name: 'User',
        email: 'directorate@dormitory.edu',
        role: 'DIRECTORATE',
        password: hashedPassword
      },
      {
        employee_id: 'Employee4',
        first_name: 'Coordinator',
        last_name: 'Four',
        email: 'coordinator4@dormitory.edu',
        role: 'COORDINATOR',
        password: hashedPassword
      },
      {
        employee_id: 'Employee5',
        first_name: 'Proctor',
        last_name: 'Five',
        email: 'proctor5@dormitory.edu',
        role: 'PROCTOR',
        password: hashedPassword
      },
      {
        employee_id: 'Employee6',
        first_name: 'Registrar',
        last_name: 'User',
        email: 'registrar@dormitory.edu',
        role: 'REGISTRAR',
        password: hashedPassword
      },
      {
        employee_id: 'Employee7',
        first_name: 'Proctor',
        last_name: 'Seven',
        email: 'proctor7@dormitory.edu',
        role: 'PROCTOR',
        password: hashedPassword
      },
      {
        employee_id: 'Employee8',
        first_name: 'Proctor',
        last_name: 'Eight',
        email: 'proctor8@dormitory.edu',
        role: 'PROCTOR',
        password: hashedPassword
      }
    ];

    console.log('📝 Inserting employee records...');

    // Insert employees using upsert to handle existing records
    for (const employee of employees) {
      try {
        const result = await prisma.employee.upsert({
          where: { employee_id: employee.employee_id },
          update: {
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            role: employee.role,
            password: employee.password,
            status: 'ACTIVE'
          },
          create: {
            employee_id: employee.employee_id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            role: employee.role,
            password: employee.password,
            status: 'ACTIVE'
          }
        });

        console.log(`✅ ${employee.employee_id} (${employee.role}) - ${result.employee_id === employee.employee_id ? 'Created/Updated' : 'Error'}`);
      } catch (error) {
        console.error(`❌ Error with ${employee.employee_id}:`, error.message);
      }
    }

    // Verify the data
    console.log('\n📊 Verifying employee data...');
    const allEmployees = await prisma.employee.findMany({
      select: {
        employee_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        status: true
      },
      orderBy: {
        employee_id: 'asc'
      }
    });

    console.log('\n📋 Current employees in database:');
    console.table(allEmployees);

    console.log('\n✅ Employee data restoration completed successfully!');
    console.log(`📈 Total employees: ${allEmployees.length}`);

  } catch (error) {
    console.error('❌ Error during employee data restoration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the restoration
restoreEmployeeData();