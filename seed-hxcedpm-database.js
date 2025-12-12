// Seed the cluster0.hxcedpm database with production data
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Target database - cluster0.hxcedpm
const TARGET_MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

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

// Sample data to insert
const employeesData = [
  {
    employee_id: 'Employee1',
    first_name: 'Dr. Alemayehu',
    last_name: 'Tadesse',
    email: 'alemayehu.tadesse@dmu.edu.et',
    role: 'admin',
    status: 'active',
    gender: 'male',
    phone: '+251911123456',
    department: 'Administration'
  },
  {
    employee_id: 'Employee2',
    first_name: 'Almaz',
    last_name: 'Desta',
    email: 'almaz.desta@dmu.edu.et',
    role: 'coordinator',
    status: 'active',
    gender: 'female',
    phone: '+251911234567',
    department: 'Dormitory Management'
  },
  {
    employee_id: 'Employee3',
    first_name: 'Aster',
    last_name: 'Bekele',
    email: 'aster.bekele@dmu.edu.et',
    role: 'directorate',
    status: 'active',
    gender: 'female',
    phone: '+251911345678',
    department: 'Student Affairs'
  },
  {
    employee_id: 'Employee4',
    first_name: 'Mulugeta',
    last_name: 'Haile',
    email: 'mulugeta.haile@dmu.edu.et',
    role: 'coordinator',
    status: 'active',
    gender: 'male',
    phone: '+251911456789',
    department: 'Dormitory Management'
  },
  {
    employee_id: 'Employee5',
    first_name: 'Tigist',
    last_name: 'Wolde',
    email: 'tigist.wolde@dmu.edu.et',
    role: 'proctor',
    status: 'active',
    gender: 'female',
    phone: '+251911567890',
    department: 'Block A Supervision'
  },
  {
    employee_id: 'Employee6',
    first_name: 'Getachew',
    last_name: 'Mekonen',
    email: 'getachew.mekonen@dmu.edu.et',
    role: 'registrar',
    status: 'active',
    gender: 'male',
    phone: '+251911678901',
    department: 'Registration Office'
  },
  {
    employee_id: 'Employee7',
    first_name: 'Hiwot',
    last_name: 'Tesfaye',
    email: 'hiwot.tesfaye@dmu.edu.et',
    role: 'proctor',
    status: 'active',
    gender: 'female',
    phone: '+251911789012',
    department: 'Block B Supervision'
  },
  {
    employee_id: 'Employee8',
    first_name: 'Bereket',
    last_name: 'Assefa',
    email: 'bereket.assefa@dmu.edu.et',
    role: 'proctor',
    status: 'active',
    gender: 'male',
    phone: '+251911890123',
    department: 'Block C Supervision'
  },
  {
    employee_id: 'Employee9',
    first_name: 'Seble',
    last_name: 'Girma',
    email: 'seble.girma@dmu.edu.et',
    role: 'proctor_manager',
    status: 'active',
    gender: 'female',
    phone: '+251911901234',
    department: 'Proctor Management'
  },
  {
    employee_id: 'Employee10',
    first_name: 'Tekle',
    last_name: 'Negash',
    email: 'tekle.negash@dmu.edu.et',
    role: 'maintainer',
    status: 'active',
    gender: 'male',
    phone: '+251911012345',
    department: 'Maintenance'
  }
];

const studentsData = [
  {
    student_id: 'Student1',
    first_name: 'Abebe',
    second_name: 'Kebede',
    last_name: 'Tesfaye',
    email: 'abebe.tesfaye@dmu.edu.et',
    gender: 'male',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'Student2',
    first_name: 'Hanan',
    second_name: 'Mohammed',
    last_name: 'Ahmed',
    email: 'hanan.ahmed@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'Student3',
    first_name: 'Dawit',
    second_name: 'Tekle',
    last_name: 'Mariam',
    email: 'dawit.mariam@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'physical',
    status: 'active'
  },
  {
    student_id: 'Student4',
    first_name: 'Meron',
    second_name: 'Tadesse',
    last_name: 'Bekele',
    email: 'meron.bekele@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'Student5',
    first_name: 'Yohannes',
    second_name: 'Haile',
    last_name: 'Desta',
    email: 'yohannes.desta@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'visual',
    status: 'active'
  },
  {
    student_id: 'Student6',
    first_name: 'Rahel',
    second_name: 'Girma',
    last_name: 'Wolde',
    email: 'rahel.wolde@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'Student7',
    first_name: 'Biniam',
    second_name: 'Alemayehu',
    last_name: 'Giorgis',
    email: 'biniam.giorgis@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'Student8',
    first_name: 'Selamawit',
    second_name: 'Bekele',
    last_name: 'Assefa',
    email: 'selamawit.assefa@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'Student9',
    first_name: 'Ephrem',
    second_name: 'Tadesse',
    last_name: 'Gebremedhin',
    email: 'ephrem.gebremedhin@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'Student10',
    first_name: 'Bethlehem',
    second_name: 'Haile',
    last_name: 'Negash',
    email: 'bethlehem.negash@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 SEEDING CLUSTER0.HXCEDPM DATABASE');
    console.log('=' .repeat(80));
    console.log('🌐 Connecting to TARGET MongoDB...');
    console.log(`   Database: cluster0.hxcedpm`);
    console.log(`   URI: ${TARGET_MONGODB_URI.substring(0, 70)}...`);
    
    await mongoose.connect(TARGET_MONGODB_URI);
    console.log('✅ Connected to TARGET MongoDB');
    
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await Employee.deleteMany({});
    await Student.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Hash the password
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Password hash generated');
    
    // Insert employees
    console.log('\n👥 Inserting employees...');
    const employeesToInsert = employeesData.map(emp => ({
      ...emp,
      password: hashedPassword
    }));
    
    const insertedEmployees = await Employee.insertMany(employeesToInsert);
    console.log(`✅ Inserted ${insertedEmployees.length} employees:`);
    insertedEmployees.forEach(emp => {
      console.log(`   ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    // Insert students
    console.log('\n🎓 Inserting students...');
    const studentsToInsert = studentsData.map(student => ({
      ...student,
      password: hashedPassword
    }));
    
    const insertedStudents = await Student.insertMany(studentsToInsert);
    console.log(`✅ Inserted ${insertedStudents.length} students:`);
    insertedStudents.forEach(student => {
      console.log(`   ${student.student_id} - ${student.first_name} ${student.last_name} (${student.gender}, ${student.batch})`);
    });
    
    // Verify Employee1 exists
    console.log('\n🔍 Verifying Employee1...');
    const employee1 = await Employee.findOne({ employee_id: 'Employee1' });
    if (employee1) {
      console.log('✅ Employee1 verification successful:');
      console.log(`   Name: ${employee1.first_name} ${employee1.last_name}`);
      console.log(`   Role: ${employee1.role}`);
      console.log(`   Email: ${employee1.email}`);
      console.log(`   Status: ${employee1.status}`);
      
      // Test password
      const passwordValid = await bcrypt.compare('password', employee1.password);
      console.log(`   Password Valid: ${passwordValid ? '✅ Yes' : '❌ No'}`);
    } else {
      console.log('❌ Employee1 verification failed');
    }
    
    // Verify Student1 exists
    console.log('\n🔍 Verifying Student1...');
    const student1 = await Student.findOne({ student_id: 'Student1' });
    if (student1) {
      console.log('✅ Student1 verification successful:');
      console.log(`   Name: ${student1.first_name} ${student1.last_name}`);
      console.log(`   Email: ${student1.email}`);
      console.log(`   Status: ${student1.status}`);
    } else {
      console.log('❌ Student1 verification failed');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from TARGET MongoDB');
    
    console.log('\n🎯 DATABASE SEEDING COMPLETED!');
    console.log('=' .repeat(80));
    console.log('✅ cluster0.hxcedpm now contains:');
    console.log(`   • ${insertedEmployees.length} employees (Employee1-Employee10)`);
    console.log(`   • ${insertedStudents.length} students (Student1-Student10)`);
    console.log('   • All passwords set to: "password"');
    console.log('   • All users are active');
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Update .env_production to use cluster0.hxcedpm');
    console.log('2. Update Vercel environment variables');
    console.log('3. Redeploy the application');
    console.log('4. Test login with Employee1 / password');
    
    console.log('\n🎯 PRODUCTION LOGIN CREDENTIALS:');
    console.log('🌐 URL: https://dmudms-next.vercel.app/auth/signin');
    console.log('👤 Admin: Employee1 / password');
    console.log('👤 Directorate: Employee3 / password');
    console.log('👤 Coordinator: Employee2 / password');
    console.log('👤 Student: Student1 / password');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
}

seedDatabase();
