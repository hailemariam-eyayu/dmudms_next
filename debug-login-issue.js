const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Corrected MongoDB connection string (fixed the typo: rretryWrites -> retryWrites)
const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Employee schema
const EmployeeSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  status: { type: String, default: 'ACTIVE' },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'employees' });

async function debugLoginIssue() {
  try {
    console.log('🔄 Connecting to MongoDB cluster (hxcedpm)...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB cluster successfully');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Check if Eden exists
    console.log('\n🔍 Searching for Eden user...');
    const edenUser = await Employee.findOne({ employee_id: 'Eden' });
    
    if (edenUser) {
      console.log('✅ Eden user found:');
      console.log({
        employee_id: edenUser.employee_id,
        first_name: edenUser.first_name,
        last_name: edenUser.last_name,
        email: edenUser.email,
        role: edenUser.role,
        status: edenUser.status,
        hasPassword: !!edenUser.password,
        passwordLength: edenUser.password ? edenUser.password.length : 0
      });
      
      // Test password verification
      console.log('\n🔐 Testing password verification...');
      const testPassword = 'password';
      const isValidPassword = await bcrypt.compare(testPassword, edenUser.password);
      console.log(`Password "${testPassword}" is valid: ${isValidPassword}`);
      
      // Also test with different cases
      const testCases = ['password', 'Password', 'PASSWORD', 'eden', 'Eden'];
      for (const testCase of testCases) {
        const isValid = await bcrypt.compare(testCase, edenUser.password);
        console.log(`Testing "${testCase}": ${isValid}`);
      }
      
    } else {
      console.log('❌ Eden user not found in database');
      
      // Let's see what users exist
      console.log('\n📋 All users in database:');
      const allUsers = await Employee.find({}, {
        employee_id: 1,
        first_name: 1,
        last_name: 1,
        role: 1,
        status: 1,
        _id: 0
      });
      console.table(allUsers);
    }
    
    // Check all admin users
    console.log('\n👑 All admin users:');
    const adminUsers = await Employee.find({ role: 'ADMIN' });
    adminUsers.forEach(admin => {
      console.log(`- ${admin.employee_id}: ${admin.first_name} ${admin.last_name} (${admin.email})`);
    });

  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the debug
debugLoginIssue();