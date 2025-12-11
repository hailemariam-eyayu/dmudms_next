// Update all user passwords to "password"
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

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

async function updatePasswords() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Hash the new password
    const newPassword = 'password';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('🔐 Updating all student passwords...');
    const studentResult = await Student.updateMany(
      {}, // Update all students
      { $set: { password: hashedPassword } }
    );
    console.log(`✅ Updated ${studentResult.modifiedCount} student passwords`);
    
    console.log('🔐 Updating all employee passwords...');
    const employeeResult = await Employee.updateMany(
      {}, // Update all employees
      { $set: { password: hashedPassword } }
    );
    console.log(`✅ Updated ${employeeResult.modifiedCount} employee passwords`);
    
    // Show some sample users for testing
    console.log('\n📋 Sample login credentials (all passwords are "password"):');
    
    const sampleEmployees = await Employee.find({ role: { $in: ['admin', 'directorate', 'coordinator'] } }).limit(5);
    console.log('\n👥 Employees:');
    sampleEmployees.forEach(emp => {
      console.log(`   ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    const sampleStudents = await Student.find().limit(3);
    console.log('\n🎓 Students:');
    sampleStudents.forEach(student => {
      console.log(`   ${student.student_id} - ${student.first_name} ${student.last_name}`);
    });
    
    console.log('\n🔑 All users now have password: "password"');
    console.log('🌐 You can login at: http://localhost:3000/auth/signin');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
  }
}

updatePasswords();