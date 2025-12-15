const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Employee schema matching the model
const EmployeeSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  role: { type: String, enum: ['admin', 'directorate', 'coordinator', 'proctor', 'security_guard', 'registrar', 'maintainer'], required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  password: { type: String, select: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'employees' });

async function testEdenLogin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Test the exact authentication flow
    console.log('\n🔍 Testing Eden authentication...');
    
    const identifier = 'Eden';
    const password = 'password';
    
    // Find employee (same as in auth.ts)
    const employee = await Employee.findOne({ employee_id: identifier }).select('+password').lean();
    
    if (employee) {
      console.log('✅ Employee found:');
      console.log(`   ID: ${employee.employee_id}`);
      console.log(`   Name: ${employee.first_name} ${employee.last_name}`);
      console.log(`   Email: ${employee.email}`);
      console.log(`   Role: ${employee.role}`);
      console.log(`   Status: ${employee.status}`);
      console.log(`   Has Password: ${!!employee.password}`);
      
      if (employee.password) {
        // Test password verification (same as in auth.ts)
        const isValid = bcrypt.compareSync(password, employee.password);
        console.log(`🔐 Password verification: ${isValid ? 'SUCCESS' : 'FAILED'}`);
        
        // Check status
        const isActive = employee.status === 'active';
        console.log(`📊 Status check: ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
        
        if (isValid && isActive) {
          console.log('\n🎉 AUTHENTICATION SUCCESSFUL!');
          console.log('Eden should now be able to log in with:');
          console.log('   Username: Eden');
          console.log('   Password: password');
        } else {
          console.log('\n❌ AUTHENTICATION FAILED');
          if (!isValid) console.log('   Reason: Invalid password');
          if (!isActive) console.log('   Reason: Account not active');
        }
      } else {
        console.log('❌ No password set for this employee');
      }
    } else {
      console.log('❌ Employee not found');
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testEdenLogin();