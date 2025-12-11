// Check what data is actually in the MongoDB database
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Define schemas to check data
const StudentSchema = new mongoose.Schema({
  student_id: String,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  batch: String,
  status: String
}, { collection: 'students' });

const EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  first_name: String,
  last_name: String,
  email: String,
  role: String,
  status: String
}, { collection: 'employees' });

const BlockSchema = new mongoose.Schema({
  block_id: String,
  name: String,
  reserved_for: String,
  status: String
}, { collection: 'blocks' });

async function checkData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const Student = mongoose.model('Student', StudentSchema);
    const Employee = mongoose.model('Employee', EmployeeSchema);
    const Block = mongoose.model('Block', BlockSchema);
    
    // Check students
    const studentCount = await Student.countDocuments();
    console.log(`📊 Students in database: ${studentCount}`);
    
    if (studentCount > 0) {
      const sampleStudents = await Student.find().limit(3);
      console.log('Sample students:', sampleStudents.map(s => ({ id: s.student_id, name: s.first_name + ' ' + s.last_name })));
    }
    
    // Check employees
    const employeeCount = await Employee.countDocuments();
    console.log(`📊 Employees in database: ${employeeCount}`);
    
    if (employeeCount > 0) {
      const sampleEmployees = await Employee.find().limit(3);
      console.log('Sample employees:', sampleEmployees.map(e => ({ id: e.employee_id, name: e.first_name + ' ' + e.last_name, role: e.role })));
    }
    
    // Check blocks
    const blockCount = await Block.countDocuments();
    console.log(`📊 Blocks in database: ${blockCount}`);
    
    if (blockCount > 0) {
      const sampleBlocks = await Block.find().limit(3);
      console.log('Sample blocks:', sampleBlocks.map(b => ({ id: b.block_id, name: b.name, reserved_for: b.reserved_for })));
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkData();