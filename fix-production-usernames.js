// Fix production database usernames to Employee1, Employee2... and Student1, Student2...
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

async function fixProductionUsernames() {
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
    
    // Get all employees sorted by their current ID for consistent ordering
    const employees = await Employee.find().sort({ employee_id: 1 });
    console.log(`Found ${employees.length} employees to update`);
    
    let employeeCount = 1;
    for (const employee of employees) {
      const newEmployeeId = `Employee${employeeCount}`;
      
      try {
        const result = await Employee.findByIdAndUpdate(
          employee._id, 
          {
            employee_id: newEmployeeId,
            password: hashedPassword
          },
          { new: true }
        );
        
        if (result) {
          console.log(`   ✅ ${employee.employee_id} → ${newEmployeeId} (${employee.first_name} ${employee.last_name} - ${employee.role})`);
        } else {
          console.log(`   ❌ Failed to update ${employee.employee_id}`);
        }
      } catch (error) {
        console.log(`   ❌ Error updating ${employee.employee_id}:`, error.message);
      }
      
      employeeCount++;
    }
    
    console.log('\n🎓 Updating PRODUCTION student usernames...');
    
    // Get all students sorted by their current ID for consistent ordering
    const students = await Student.find().sort({ student_id: 1 });
    console.log(`Found ${students.length} students to update`);
    
    let studentCount = 1;
    for (const student of students) {
      const newStudentId = `Student${studentCount}`;
      
      try {
        const result = await Student.findByIdAndUpdate(
          student._id,
          {
            student_id: newStudentId,
            password: hashedPassword
          },
          { new: true }
        );
        
        if (result) {
          console.log(`   ✅ ${student.student_id} → ${newStudentId} (${student.first_name} ${student.last_name})`);
        } else {
          console.log(`   ❌ Failed to update ${student.student_id}`);
        }
      } catch (error) {
        console.log(`   ❌ Error updating ${student.student_id}:`, error.message);
      }
      
      studentCount++;
    }
    
    // Verify the changes
    console.log('\n🔍 Verifying updates...');
    
    const updatedEmployees = await Employee.find({ role: { $in: ['admin', 'directorate', 'coordinator'] } }).sort({ employee_id: 1 });
    console.log('\n👥 Updated Employees:');
    updatedEmployees.forEach(emp => {
      console.log(`   ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    const updatedStudents = await Student.find().sort({ student_id: 1 }).limit(5);
    console.log('\n🎓 Updated Students (first 5):');
    updatedStudents.forEach(student => {
      console.log(`   ${student.student_id} - ${student.first_name} ${student.last_name}`);
    });
    
    // Test Employee1 specifically
    const employee1 = await Employee.findOne({ employee_id: 'Employee1' });
    if (employee1) {
      console.log('\n✅ Employee1 verification successful:');
      console.log(`   Name: ${employee1.first_name} ${employee1.last_name}`);
      console.log(`   Role: ${employee1.role}`);
      console.log(`   Email: ${employee1.email}`);
    } else {
      console.log('\n❌ Employee1 verification failed - not found');
    }
    
    console.log('\n🎯 PRODUCTION Login Credentials:');
    console.log('🌐 URL: https://dmudms-next.vercel.app/auth/signin');
    console.log('🔑 Password: "password" for all users');
    console.log('\n📋 Key Accounts:');
    console.log('   • Employee1 - Admin (Full Access)');
    console.log('   • Employee2 - Directorate (Block Management)');
    console.log('   • Employee3 - Coordinator (Proctor Management)');
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from PRODUCTION MongoDB');
    
  } catch (error) {
    console.error('❌ Error fixing PRODUCTION usernames:', error);
  }
}

fixProductionUsernames();