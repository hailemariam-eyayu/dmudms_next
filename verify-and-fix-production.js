// Comprehensive script to verify and fix production database issues
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// All possible MongoDB URIs that might be used
const POSSIBLE_MONGODB_URIS = [
  "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0",
  "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0",
  "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/?appName=Cluster0"
];

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

async function testDatabaseConnection(uri, index) {
  try {
    console.log(`\n🔍 Testing Database ${index + 1}: ${uri.substring(0, 50)}...`);
    
    // Create new connection for this test
    const connection = await mongoose.createConnection(uri);
    console.log('✅ Connection successful');
    
    const Student = connection.model('Student', StudentSchema);
    const Employee = connection.model('Employee', EmployeeSchema);
    
    // Check data
    const employeeCount = await Employee.countDocuments();
    const studentCount = await Student.countDocuments();
    
    console.log(`   📊 Employees: ${employeeCount}, Students: ${studentCount}`);
    
    // Check for Employee1
    const employee1 = await Employee.findOne({ employee_id: 'Employee1' });
    const emp001 = await Employee.findOne({ employee_id: 'EMP001' });
    
    console.log(`   🔍 Employee1 exists: ${employee1 ? '✅ YES' : '❌ NO'}`);
    console.log(`   🔍 EMP001 exists: ${emp001 ? '✅ YES' : '❌ NO'}`);
    
    if (employee1) {
      console.log(`   👤 Employee1: ${employee1.first_name} ${employee1.last_name} (${employee1.role})`);
    }
    
    // List first few employees to see the pattern
    const employees = await Employee.find().limit(3).sort({ employee_id: 1 });
    console.log('   📋 Sample employees:');
    employees.forEach(emp => {
      console.log(`      ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    await connection.close();
    
    return {
      uri,
      connected: true,
      employeeCount,
      studentCount,
      hasEmployee1: !!employee1,
      hasEMP001: !!emp001,
      employees: employees.map(e => ({ id: e.employee_id, name: `${e.first_name} ${e.last_name}`, role: e.role }))
    };
    
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return {
      uri,
      connected: false,
      error: error.message
    };
  }
}

async function fixProductionDatabase(uri) {
  try {
    console.log(`\n🔧 Fixing database: ${uri.substring(0, 50)}...`);
    
    await mongoose.connect(uri);
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Hash the password
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('👥 Updating employee usernames...');
    
    // Get all employees and update them
    const employees = await Employee.find().sort({ employee_id: 1 });
    console.log(`Found ${employees.length} employees`);
    
    let employeeCount = 1;
    for (const employee of employees) {
      const newEmployeeId = `Employee${employeeCount}`;
      
      await Employee.findByIdAndUpdate(
        employee._id, 
        {
          employee_id: newEmployeeId,
          password: hashedPassword
        }
      );
      
      console.log(`   ✅ ${employee.employee_id} → ${newEmployeeId} (${employee.first_name} ${employee.last_name})`);
      employeeCount++;
    }
    
    console.log('\n🎓 Updating student usernames...');
    
    // Get all students and update them
    const students = await Student.find().sort({ student_id: 1 });
    console.log(`Found ${students.length} students`);
    
    let studentCount = 1;
    for (const student of students) {
      const newStudentId = `Student${studentCount}`;
      
      await Student.findByIdAndUpdate(
        student._id,
        {
          student_id: newStudentId,
          password: hashedPassword
        }
      );
      
      console.log(`   ✅ ${student.student_id} → ${newStudentId} (${student.first_name} ${student.last_name})`);
      studentCount++;
    }
    
    // Verify Employee1 exists
    const employee1 = await Employee.findOne({ employee_id: 'Employee1' });
    if (employee1) {
      console.log('\n✅ Verification successful - Employee1 exists');
      console.log(`   Name: ${employee1.first_name} ${employee1.last_name}`);
      console.log(`   Role: ${employee1.role}`);
    } else {
      console.log('\n❌ Verification failed - Employee1 not found');
    }
    
    await mongoose.disconnect();
    return true;
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    return false;
  }
}

async function main() {
  console.log('🔍 COMPREHENSIVE PRODUCTION DATABASE VERIFICATION');
  console.log('=' .repeat(80));
  
  const results = [];
  
  // Test all possible database connections
  for (let i = 0; i < POSSIBLE_MONGODB_URIS.length; i++) {
    const result = await testDatabaseConnection(POSSIBLE_MONGODB_URIS[i], i);
    results.push(result);
  }
  
  console.log('\n📊 SUMMARY OF ALL DATABASES:');
  console.log('=' .repeat(80));
  
  results.forEach((result, index) => {
    console.log(`\nDatabase ${index + 1}:`);
    console.log(`   URI: ${result.uri.substring(0, 60)}...`);
    console.log(`   Connected: ${result.connected ? '✅' : '❌'}`);
    
    if (result.connected) {
      console.log(`   Employees: ${result.employeeCount}, Students: ${result.studentCount}`);
      console.log(`   Has Employee1: ${result.hasEmployee1 ? '✅' : '❌'}`);
      console.log(`   Has EMP001: ${result.hasEMP001 ? '✅' : '❌'}`);
      
      if (result.employees.length > 0) {
        console.log('   Sample users:');
        result.employees.forEach(emp => {
          console.log(`      ${emp.id} - ${emp.name} (${emp.role})`);
        });
      }
    } else {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  // Find the database that needs fixing
  const databaseToFix = results.find(r => r.connected && r.employeeCount > 0 && !r.hasEmployee1);
  
  if (databaseToFix) {
    console.log('\n🔧 FIXING DATABASE WITH OLD USERNAMES');
    console.log('=' .repeat(80));
    console.log(`Target database: ${databaseToFix.uri.substring(0, 60)}...`);
    
    const fixed = await fixProductionDatabase(databaseToFix.uri);
    
    if (fixed) {
      console.log('\n✅ DATABASE FIXED SUCCESSFULLY!');
      console.log('\n🎯 PRODUCTION LOGIN CREDENTIALS:');
      console.log('🌐 URL: https://dmudms-next.vercel.app/auth/signin');
      console.log('🔑 Username: Employee1');
      console.log('🔑 Password: password');
    } else {
      console.log('\n❌ FAILED TO FIX DATABASE');
    }
  } else {
    const workingDb = results.find(r => r.connected && r.hasEmployee1);
    if (workingDb) {
      console.log('\n✅ FOUND WORKING DATABASE WITH CORRECT USERNAMES');
      console.log(`Database: ${workingDb.uri.substring(0, 60)}...`);
      console.log('\n🎯 PRODUCTION LOGIN CREDENTIALS:');
      console.log('🌐 URL: https://dmudms-next.vercel.app/auth/signin');
      console.log('🔑 Username: Employee1');
      console.log('🔑 Password: password');
    } else {
      console.log('\n❌ NO SUITABLE DATABASE FOUND');
      console.log('All databases either have no data or already have correct usernames');
    }
  }
}

main().catch(console.error);