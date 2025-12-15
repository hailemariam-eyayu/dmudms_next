const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Corrected MongoDB connection string
const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Employee schema matching the model
const EmployeeSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  role: { type: String, enum: ['admin', 'directorate', 'coordinator', 'proctor', 'security_guard', 'registrar', 'maintainer'], required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  password: { type: String, select: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'employees' });

async function fixEmployeeCaseIssue() {
  try {
    console.log('🔄 Connecting to MongoDB cluster (hxcedpm)...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB cluster successfully');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Hash the password 'password' 
    const hashedPassword = await bcrypt.hash('password', 12);
    console.log('🔐 Password hashed successfully');

    // Corrected employee data with lowercase roles and status, plus gender field
    const employees = [
      // Eden admin user
      {
        employee_id: 'Eden',
        first_name: 'Eden',
        last_name: 'Haile Eyayu',
        email: 'hailemariameyayu@gmail.com',
        gender: 'male', // Added required gender field
        role: 'admin', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      // Login page employees
      {
        employee_id: 'Employee1',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@dormitory.edu',
        gender: 'male',
        role: 'admin', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      {
        employee_id: 'Employee2',
        first_name: 'Coordinator',
        last_name: 'Two',
        email: 'coordinator2@dormitory.edu',
        gender: 'female',
        role: 'coordinator', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      {
        employee_id: 'Employee3',
        first_name: 'Directorate',
        last_name: 'User',
        email: 'directorate@dormitory.edu',
        gender: 'male',
        role: 'directorate', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      {
        employee_id: 'Employee4',
        first_name: 'Coordinator',
        last_name: 'Four',
        email: 'coordinator4@dormitory.edu',
        gender: 'female',
        role: 'coordinator', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      {
        employee_id: 'Employee5',
        first_name: 'Proctor',
        last_name: 'Five',
        email: 'proctor5@dormitory.edu',
        gender: 'male',
        role: 'proctor', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      {
        employee_id: 'Employee6',
        first_name: 'Registrar',
        last_name: 'User',
        email: 'registrar@dormitory.edu',
        gender: 'female',
        role: 'registrar', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      {
        employee_id: 'Employee7',
        first_name: 'Proctor',
        last_name: 'Seven',
        email: 'proctor7@dormitory.edu',
        gender: 'male',
        role: 'proctor', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      },
      {
        employee_id: 'Employee8',
        first_name: 'Proctor',
        last_name: 'Eight',
        email: 'proctor8@dormitory.edu',
        gender: 'female',
        role: 'proctor', // lowercase
        status: 'active', // lowercase
        password: hashedPassword
      }
    ];

    console.log('📝 Fixing employee records with correct case and required fields...');

    // Delete existing records and insert corrected ones
    await Employee.deleteMany({ employee_id: { $in: employees.map(e => e.employee_id) } });
    console.log('🗑️ Removed existing employee records');

    // Insert corrected employees
    for (const employee of employees) {
      try {
        const newEmployee = new Employee({
          ...employee,
          updated_at: new Date()
        });
        
        const result = await newEmployee.save();
        console.log(`✅ ${employee.employee_id} (${employee.role}) - Created successfully`);
      } catch (error) {
        console.error(`❌ Error with ${employee.employee_id}:`, error.message);
      }
    }

    // Verify the data
    console.log('\n📊 Verifying corrected employee data...');
    const allEmployees = await Employee.find({}, {
      employee_id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      gender: 1,
      role: 1,
      status: 1,
      _id: 0
    }).sort({ employee_id: 1 });

    console.log('\n📋 Corrected employees in database:');
    console.table(allEmployees.map(emp => ({
      ID: emp.employee_id,
      Name: `${emp.first_name} ${emp.last_name}`,
      Email: emp.email,
      Gender: emp.gender,
      Role: emp.role,
      Status: emp.status
    })));

    // Test Eden login specifically
    console.log('\n🔍 Testing Eden login...');
    const edenUser = await Employee.findOne({ employee_id: 'Eden' }).select('+password');
    if (edenUser) {
      const isValidPassword = await bcrypt.compare('password', edenUser.password);
      console.log(`✅ Eden user found with correct structure`);
      console.log(`🔐 Password test for Eden: ${isValidPassword ? 'PASS' : 'FAIL'}`);
      console.log(`📋 Eden details: ${edenUser.employee_id} | ${edenUser.role} | ${edenUser.status}`);
    }

    console.log('\n✅ Employee data correction completed successfully!');
    console.log(`📈 Total employees: ${allEmployees.length}`);

  } catch (error) {
    console.error('❌ Error during employee data correction:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the correction
fixEmployeeCaseIssue();