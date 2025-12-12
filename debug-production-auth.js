// Debug production authentication
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PRODUCTION_MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Define schemas
const EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  first_name: String,
  last_name: String,
  email: String,
  role: String,
  status: String,
  password: String
}, { collection: 'employees' });

async function debugAuth() {
  try {
    console.log('🌐 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to PRODUCTION MongoDB');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Find Employee1 (admin)
    const employee = await Employee.findOne({ employee_id: 'Employee1' });
    
    if (!employee) {
      console.log('❌ Employee1 not found in database');
      return;
    }
    
    console.log('👤 Found Employee1:');
    console.log(`   ID: ${employee.employee_id}`);
    console.log(`   Name: ${employee.first_name} ${employee.last_name}`);
    console.log(`   Role: ${employee.role}`);
    console.log(`   Status: ${employee.status}`);
    console.log(`   Email: ${employee.email}`);
    console.log(`   Password Hash: ${employee.password ? employee.password.substring(0, 20) + '...' : 'NO PASSWORD'}`);
    
    // Test password verification
    const testPassword = 'password';
    console.log(`\n🔐 Testing password: "${testPassword}"`);
    
    if (employee.password) {
      const isValid = bcrypt.compareSync(testPassword, employee.password);
      console.log(`   Password Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
      
      if (!isValid) {
        console.log('\n🔧 Fixing password...');
        const newHashedPassword = bcrypt.hashSync(testPassword, 12);
        await Employee.findByIdAndUpdate(employee._id, {
          password: newHashedPassword
        });
        console.log('✅ Password updated successfully');
        
        // Test again
        const updatedEmployee = await Employee.findOne({ employee_id: 'Employee1' });
        const isValidNow = bcrypt.compareSync(testPassword, updatedEmployee.password);
        console.log(`   Password Valid Now: ${isValidNow ? '✅ YES' : '❌ NO'}`);
      }
    } else {
      console.log('❌ No password hash found');
      console.log('\n🔧 Setting password...');
      const hashedPassword = bcrypt.hashSync(testPassword, 12);
      await Employee.findByIdAndUpdate(employee._id, {
        password: hashedPassword
      });
      console.log('✅ Password set successfully');
    }
    
    console.log('\n🎯 Production Login Test:');
    console.log('   URL: https://dmudms-next.vercel.app/auth/signin');
    console.log('   Username: Employee1');
    console.log('   Password: password');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from PRODUCTION MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugAuth();