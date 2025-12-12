// Force fix production database with multiple attempts and verification
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// The correct production MongoDB URI
const PRODUCTION_MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Define schemas
const StudentSchema = new mongoose.Schema({
  student_id: String,
  first_name: String,
  second_name: String,
  last_name: String,
  email: String,
  gender: String,
  batch: String,
  disability_status: String,
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
  gender: String,
  phone: String,
  department: String,
  password: String
}, { collection: 'employees' });

async function forceFixProduction() {
  try {
    console.log('🔧 FORCE FIXING PRODUCTION DATABASE');
    console.log('=' .repeat(80));
    console.log('🌐 Connecting to PRODUCTION MongoDB...');
    
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to PRODUCTION MongoDB');
    
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // First, let's see what we have
    console.log('\n📊 Current database state:');
    const currentEmployees = await Employee.find().sort({ employee_id: 1 });
    const currentStudents = await Student.find().sort({ student_id: 1 });
    
    console.log(`   Employees: ${currentEmployees.length}`);
    console.log(`   Students: ${currentStudents.length}`);
    
    if (currentEmployees.length > 0) {
      console.log('   Current employee IDs:');
      currentEmployees.forEach(emp => {
        console.log(`      ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
      });
    }
    
    // Hash the password
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('\n🔐 Password hash generated');
    
    // Force update all employees regardless of current state
    console.log('\n👥 FORCE UPDATING ALL EMPLOYEES...');
    
    let employeeCount = 1;
    for (const employee of currentEmployees) {
      const newEmployeeId = `Employee${employeeCount}`;
      
      try {
        const result = await Employee.findByIdAndUpdate(
          employee._id, 
          {
            employee_id: newEmployeeId,
            password: hashedPassword,
            status: 'active' // Ensure status is active
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
    
    // Force update all students
    console.log('\n🎓 FORCE UPDATING ALL STUDENTS...');
    
    let studentCount = 1;
    for (const student of currentStudents) {
      const newStudentId = `Student${studentCount}`;
      
      try {
        const result = await Student.findByIdAndUpdate(
          student._id,
          {
            student_id: newStudentId,
            password: hashedPassword,
            status: 'active' // Ensure status is active
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
    
    // Multiple verification attempts
    console.log('\n🔍 COMPREHENSIVE VERIFICATION...');
    
    // Wait a moment for database to sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify Employee1 exists with multiple queries
    console.log('\n1️⃣ Testing Employee1 existence...');
    const employee1_test1 = await Employee.findOne({ employee_id: 'Employee1' });
    const employee1_test2 = await Employee.findOne({ employee_id: 'Employee1' }).lean();
    const allEmployees = await Employee.find({ employee_id: { $regex: /^Employee/ } }).sort({ employee_id: 1 });
    
    console.log(`   Direct query: ${employee1_test1 ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Lean query: ${employee1_test2 ? '✅ Found' : '❌ Not found'}`);
    console.log(`   All Employee* users: ${allEmployees.length}`);
    
    if (employee1_test1) {
      console.log(`   ✅ Employee1 details:`);
      console.log(`      Name: ${employee1_test1.first_name} ${employee1_test1.last_name}`);
      console.log(`      Role: ${employee1_test1.role}`);
      console.log(`      Status: ${employee1_test1.status}`);
      console.log(`      Email: ${employee1_test1.email}`);
      console.log(`      Has Password: ${employee1_test1.password ? 'Yes' : 'No'}`);
      
      // Test password
      if (employee1_test1.password) {
        const passwordValid = await bcrypt.compare('password', employee1_test1.password);
        console.log(`      Password Valid: ${passwordValid ? '✅ Yes' : '❌ No'}`);
      }
    }
    
    // List all employees for verification
    console.log('\n📋 ALL UPDATED EMPLOYEES:');
    allEmployees.forEach(emp => {
      console.log(`   ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role}) - Status: ${emp.status}`);
    });
    
    // Test Student1 as well
    console.log('\n2️⃣ Testing Student1 existence...');
    const student1 = await Student.findOne({ student_id: 'Student1' });
    console.log(`   Student1: ${student1 ? '✅ Found' : '❌ Not found'}`);
    
    if (student1) {
      console.log(`      Name: ${student1.first_name} ${student1.last_name}`);
      console.log(`      Status: ${student1.status}`);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from PRODUCTION MongoDB');
    
    console.log('\n🎯 PRODUCTION LOGIN CREDENTIALS:');
    console.log('=' .repeat(80));
    console.log('🌐 URL: https://dmudms-next.vercel.app/auth/signin');
    console.log('👤 Admin: Employee1 / password');
    console.log('👤 Directorate: Employee3 / password');
    console.log('👤 Coordinator: Employee2 / password');
    console.log('👤 Student: Student1 / password');
    
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Redeploy the Vercel application to clear any caches');
    console.log('2. Test login immediately after deployment');
    console.log('3. If still failing, check Vercel environment variables');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error in force fix:', error);
    return false;
  }
}

forceFixProduction();