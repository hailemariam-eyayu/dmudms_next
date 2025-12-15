const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Employee schema
const EmployeeSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  status: { type: String, default: 'ACTIVE' },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'employees' });

async function restoreEmployeeData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Hash the password 'password' for all employees
    const hashedPassword = await bcrypt.hash('password', 12);
    console.log('🔐 Password hashed successfully');

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

    console.log('📝 Inserting/updating employee records...');

    // Clear existing employees first (optional - remove this if you want to keep existing data)
    // await Employee.deleteMany({});
    // console.log('🗑️ Cleared existing employee data');

    // Insert employees using upsert to handle existing records
    for (const employee of employees) {
      try {
        const result = await Employee.findOneAndUpdate(
          { employee_id: employee.employee_id },
          {
            ...employee,
            status: 'ACTIVE',
            updated_at: new Date()
          },
          { 
            upsert: true, 
            new: true,
            runValidators: true
          }
        );

        console.log(`✅ ${employee.employee_id} (${employee.role}) - ${result ? 'Created/Updated' : 'Error'}`);
      } catch (error) {
        console.error(`❌ Error with ${employee.employee_id}:`, error.message);
      }
    }

    // Verify the data
    console.log('\n📊 Verifying employee data...');
    const allEmployees = await Employee.find({}, {
      employee_id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      role: 1,
      status: 1,
      _id: 0
    }).sort({ employee_id: 1 });

    console.log('\n📋 Current employees in database:');
    console.table(allEmployees.map(emp => ({
      ID: emp.employee_id,
      Name: `${emp.first_name} ${emp.last_name}`,
      Email: emp.email,
      Role: emp.role,
      Status: emp.status
    })));

    console.log('\n✅ Employee data restoration completed successfully!');
    console.log(`📈 Total employees: ${allEmployees.length}`);

  } catch (error) {
    console.error('❌ Error during employee data restoration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the restoration
restoreEmployeeData();