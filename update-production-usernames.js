// Update production database usernames to Employee1, Employee2... and Student1, Student2...
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// PRODUCTION MongoDB URI
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

async function updateProductionUsernames() {
  try {
    console.log('🌐 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to PRODUCTION MongoDB');
    
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Hash the password
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('👥 Updating PRODUCTION employee usernames...');
    
    // Get all employees and update their IDs
    const employees = await Employee.find().sort({ _id: 1 });
    let employeeCount = 1;
    
    for (const employee of employees) {
      const newEmployeeId = `Employee${employeeCount}`;
      await Employee.findByIdAndUpdate(employee._id, {
        employee_id: newEmployeeId,
        password: hashedPassword
      });
      console.log(`   Updated: ${employee.employee_id} → ${newEmployeeId} (${employee.first_name} ${employee.last_name} - ${employee.role})`);
      employeeCount++;
    }
    
    console.log('🎓 Updating PRODUCTION student usernames...');
    
    // Get all students and update their IDs
    const students = await Student.find().sort({ _id: 1 });
    let studentCount = 1;
    
    for (const student of students) {
      const newStudentId = `Student${studentCount}`;
      await Student.findByIdAndUpdate(student._id, {
        student_id: newStudentId,
        password: hashedPassword
      });
      console.log(`   Updated: ${student.student_id} → ${newStudentId} (${student.first_name} ${student.last_name})`);
      studentCount++;
    }
    
    console.log('\n🎯 PRODUCTION Login Credentials (password: "password"):');
    
    // Show updated credentials
    const updatedEmployees = await Employee.find({ role: { $in: ['admin', 'directorate', 'coordinator'] } }).sort({ employee_id: 1 });
    console.log('\n👥 Employees:');
    updatedEmployees.forEach(emp => {
      console.log(`   ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    const updatedStudents = await Student.find().sort({ student_id: 1 }).limit(5);
    console.log('\n🎓 Students (first 5):');
    updatedStudents.forEach(student => {
      console.log(`   ${student.student_id} - ${student.first_name} ${student.last_name}`);
    });
    
    console.log('\n🌐 Production URL: https://dmudms-next.vercel.app/auth/signin');
    console.log('🔑 All passwords are: "password"');
    console.log('\n📋 Key Production Accounts:');
    console.log('   • Employee1 - Admin (Full Access)');
    console.log('   • Employee2 - Directorate (Block Management)');
    console.log('   • Employee3 - Coordinator (Proctor Management)');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from PRODUCTION MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating PRODUCTION usernames:', error);
  }
}

updateProductionUsernames();