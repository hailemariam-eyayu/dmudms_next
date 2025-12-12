// Check what's actually in the production database
const mongoose = require('mongoose');

const PRODUCTION_MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Define schemas
const StudentSchema = new mongoose.Schema({
  student_id: String,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  batch: String,
  status: String,
  password: String
}, { collection: 'students' });

const EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  first_name: String,
  last_name: String,
  email: String,
  role: String,
  status: String,
  password: String
}, { collection: 'employees' });

async function checkProductionData() {
  try {
    console.log('🌐 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to PRODUCTION MongoDB');
    
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Check employees
    console.log('\n👥 ALL EMPLOYEES in production:');
    const employees = await Employee.find().sort({ employee_id: 1 });
    employees.forEach((emp, index) => {
      console.log(`   ${index + 1}. ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    // Check students
    console.log('\n🎓 ALL STUDENTS in production:');
    const students = await Student.find().sort({ student_id: 1 });
    students.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.student_id} - ${student.first_name} ${student.last_name}`);
    });
    
    // Check specific Employee1
    console.log('\n🔍 Searching for Employee1...');
    const employee1 = await Employee.findOne({ employee_id: 'Employee1' });
    if (employee1) {
      console.log('✅ Employee1 found:', {
        id: employee1.employee_id,
        name: `${employee1.first_name} ${employee1.last_name}`,
        role: employee1.role,
        email: employee1.email,
        hasPassword: !!employee1.password
      });
    } else {
      console.log('❌ Employee1 NOT found');
    }
    
    // Check if there are any employees with admin role
    console.log('\n🔍 Searching for admin users...');
    const adminUsers = await Employee.find({ role: 'admin' });
    console.log(`Found ${adminUsers.length} admin users:`);
    adminUsers.forEach(admin => {
      console.log(`   ${admin.employee_id} - ${admin.first_name} ${admin.last_name}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from PRODUCTION MongoDB');
    
  } catch (error) {
    console.error('❌ Error checking production data:', error);
  }
}

checkProductionData();