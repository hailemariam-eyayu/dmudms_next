// Compare demo (local sample data) vs production (MongoDB) data
const mongoose = require('mongoose');

// Production MongoDB URI
const PRODUCTION_MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Import local demo data
const path = require('path');
const fs = require('fs');

// Define schemas for production data
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

const BlockSchema = new mongoose.Schema({
  block_id: String,
  name: String,
  reserved_for: String,
  status: String,
  disable_group: Boolean,
  floors: Number,
  rooms_per_floor: Number,
  room_capacity: Number,
  proctor_id: String,
  location: String
}, { collection: 'blocks' });

const RoomSchema = new mongoose.Schema({
  room_id: String,
  block: String,
  floor: Number,
  room_number: String,
  status: String,
  capacity: Number,
  current_occupancy: Number,
  disability_accessible: Boolean
}, { collection: 'rooms' });

const PlacementSchema = new mongoose.Schema({
  student_id: String,
  room: String,
  block: String,
  year: String,
  status: String,
  assigned_date: Date
}, { collection: 'studentplacements' });

// Demo data (from sampleData.ts)
const demoData = {
  students: [
    { student_id: 'DMU001', first_name: 'Abebe', last_name: 'Tesfaye', email: 'abebe.tesfaye@dmu.edu', gender: 'male', batch: '2024', disability_status: 'none', status: 'active' },
    { student_id: 'DMU002', first_name: 'Hanan', last_name: 'Ahmed', email: 'hanan.ahmed@dmu.edu', gender: 'female', batch: '2024', disability_status: 'none', status: 'active' },
    { student_id: 'DMU003', first_name: 'Dawit', last_name: 'Mariam', email: 'dawit.mariam@dmu.edu', gender: 'male', batch: '2023', disability_status: 'physical', status: 'active' },
    { student_id: 'DMU004', first_name: 'Meron', last_name: 'Bekele', email: 'meron.bekele@dmu.edu', gender: 'female', batch: '2024', disability_status: 'none', status: 'active' },
    { student_id: 'DMU005', first_name: 'Yohannes', last_name: 'Desta', email: 'yohannes.desta@dmu.edu', gender: 'male', batch: '2023', disability_status: 'visual', status: 'active' }
  ],
  employees: [
    { employee_id: 'EMP001', first_name: 'Dr. Alemayehu', last_name: 'Tadesse', email: 'alemayehu.tadesse@dmu.edu', role: 'admin', status: 'active', gender: 'male', department: 'Administration' },
    { employee_id: 'EMP002', first_name: 'Aster', last_name: 'Bekele', email: 'aster.bekele@dmu.edu', role: 'directorate', status: 'active', gender: 'female', department: 'Student Affairs' },
    { employee_id: 'EMP003', first_name: 'Mulugeta', last_name: 'Haile', email: 'mulugeta.haile@dmu.edu', role: 'coordinator', status: 'active', gender: 'male', department: 'Dormitory Management' },
    { employee_id: 'EMP004', first_name: 'Tigist', last_name: 'Wolde', email: 'tigist.wolde@dmu.edu', role: 'proctor', status: 'active', gender: 'female', department: 'Block A Supervision' },
    { employee_id: 'EMP005', first_name: 'Getachew', last_name: 'Mekonen', email: 'getachew.mekonen@dmu.edu', role: 'registrar', status: 'active', gender: 'male', department: 'Registration Office' }
  ]
};

async function compareData() {
  try {
    console.log('🔍 DEMO vs PRODUCTION DATA COMPARISON');
    console.log('=' .repeat(80));
    
    // Connect to production database
    console.log('🌐 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to PRODUCTION MongoDB\n');
    
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    const Block = mongoose.model('Block', BlockSchema);
    const Room = mongoose.model('Room', RoomSchema);
    const Placement = mongoose.model('Placement', PlacementSchema);
    
    // Get production data
    const [prodStudents, prodEmployees, prodBlocks, prodRooms, prodPlacements] = await Promise.all([
      Student.find().lean(),
      Employee.find().lean(),
      Block.find().lean(),
      Room.find().lean(),
      Placement.find().lean()
    ]);
    
    // STUDENTS COMPARISON
    console.log('👥 STUDENTS COMPARISON');
    console.log('-'.repeat(50));
    console.log(`📊 Count: Demo (${demoData.students.length}) vs Production (${prodStudents.length})`);
    console.log('\n🏠 DEMO STUDENTS (Local Development):');
    demoData.students.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.student_id} - ${student.first_name} ${student.last_name} (${student.gender}, ${student.batch})`);
    });
    
    console.log('\n🌐 PRODUCTION STUDENTS (Live System):');
    prodStudents.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.student_id} - ${student.first_name} ${student.last_name} (${student.gender}, ${student.batch})`);
    });
    
    // EMPLOYEES COMPARISON
    console.log('\n\n👔 EMPLOYEES COMPARISON');
    console.log('-'.repeat(50));
    console.log(`📊 Count: Demo (${demoData.employees.length}) vs Production (${prodEmployees.length})`);
    console.log('\n🏠 DEMO EMPLOYEES (Local Development):');
    demoData.employees.forEach((emp, index) => {
      console.log(`   ${index + 1}. ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    console.log('\n🌐 PRODUCTION EMPLOYEES (Live System):');
    prodEmployees.forEach((emp, index) => {
      console.log(`   ${index + 1}. ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    // BLOCKS COMPARISON
    console.log('\n\n🏢 BLOCKS COMPARISON');
    console.log('-'.repeat(50));
    console.log(`📊 Count: Demo (0 - not seeded) vs Production (${prodBlocks.length})`);
    
    if (prodBlocks.length > 0) {
      console.log('\n🌐 PRODUCTION BLOCKS:');
      prodBlocks.forEach((block, index) => {
        console.log(`   ${index + 1}. ${block.block_id} - ${block.name} (${block.reserved_for}, ${block.status})`);
      });
    } else {
      console.log('\n❌ No blocks found in production');
    }
    
    // ROOMS COMPARISON
    console.log('\n\n🏠 ROOMS COMPARISON');
    console.log('-'.repeat(50));
    console.log(`📊 Count: Demo (0 - not seeded) vs Production (${prodRooms.length})`);
    
    if (prodRooms.length > 0) {
      console.log('\n🌐 PRODUCTION ROOMS (first 10):');
      prodRooms.slice(0, 10).forEach((room, index) => {
        console.log(`   ${index + 1}. ${room.room_id} - Block ${room.block}, Floor ${room.floor} (${room.status}, ${room.current_occupancy}/${room.capacity})`);
      });
      if (prodRooms.length > 10) {
        console.log(`   ... and ${prodRooms.length - 10} more rooms`);
      }
    } else {
      console.log('\n❌ No rooms found in production');
    }
    
    // PLACEMENTS COMPARISON
    console.log('\n\n🎯 PLACEMENTS COMPARISON');
    console.log('-'.repeat(50));
    console.log(`📊 Count: Demo (0 - not seeded) vs Production (${prodPlacements.length})`);
    
    if (prodPlacements.length > 0) {
      console.log('\n🌐 PRODUCTION PLACEMENTS (first 10):');
      prodPlacements.slice(0, 10).forEach((placement, index) => {
        console.log(`   ${index + 1}. ${placement.student_id} → Room ${placement.room}, Block ${placement.block} (${placement.status})`);
      });
      if (prodPlacements.length > 10) {
        console.log(`   ... and ${prodPlacements.length - 10} more placements`);
      }
    } else {
      console.log('\n❌ No placements found in production');
    }
    
    // LOGIN CREDENTIALS COMPARISON
    console.log('\n\n🔑 LOGIN CREDENTIALS COMPARISON');
    console.log('-'.repeat(50));
    console.log('\n🏠 DEMO/LOCAL CREDENTIALS (http://localhost:3000):');
    console.log('   Password: "default123" for all users');
    console.log('   Admin: EMP001 / default123');
    console.log('   Directorate: EMP002 / default123');
    console.log('   Coordinator: EMP003 / default123');
    console.log('   Student: DMU001 / default123');
    
    console.log('\n🌐 PRODUCTION CREDENTIALS (https://dmudms-next.vercel.app):');
    console.log('   Password: "password" for all users');
    console.log('   Admin: Employee1 / password');
    console.log('   Coordinator: Employee2 / password');
    console.log('   Directorate: Employee3 / password');
    console.log('   Student: Student1 / password');
    
    // ENVIRONMENT SUMMARY
    console.log('\n\n📋 ENVIRONMENT SUMMARY');
    console.log('=' .repeat(80));
    console.log('🏠 LOCAL/DEMO ENVIRONMENT:');
    console.log('   • URL: http://localhost:3000');
    console.log('   • Data: In-memory sample data (resets on restart)');
    console.log('   • Users: Ethiopian names with original IDs');
    console.log('   • Purpose: Development and testing');
    console.log('   • Password: "default123"');
    
    console.log('\n🌐 PRODUCTION ENVIRONMENT:');
    console.log('   • URL: https://dmudms-next.vercel.app');
    console.log('   • Data: MongoDB Atlas (persistent)');
    console.log('   • Users: Generic names with Employee/Student IDs');
    console.log('   • Purpose: Live system usage');
    console.log('   • Password: "password"');
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from PRODUCTION MongoDB');
    
  } catch (error) {
    console.error('❌ Error comparing data:', error);
  }
}

compareData();