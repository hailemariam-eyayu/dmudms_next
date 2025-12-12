// Restore Employee1's password in production
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PRODUCTION_MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

const EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  first_name: String,
  last_name: String,
  email: String,
  role: String,
  status: String,
  password: String,
  phone: String
}, { collection: 'employees' });

async function restoreEmployee1Password() {
  try {
    console.log('🌐 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to PRODUCTION MongoDB');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Hash the password
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Update Employee1's password
    const result = await Employee.findOneAndUpdate(
      { employee_id: 'Employee1' },
      { password: hashedPassword },
      { new: true }
    );
    
    if (result) {
      console.log('✅ Employee1 password restored successfully!');
      console.log(`   Name: ${result.first_name} ${result.last_name}`);
      console.log(`   Role: ${result.role}`);
      console.log(`   Phone: ${result.phone || 'Not set'}`);
      console.log(`   Password set: ${!!result.password}`);
      
      // Test the password
      const isValidPassword = await bcrypt.compare('password', result.password);
      console.log(`   Password "password" works: ${isValidPassword}`);
      
      console.log('\n🎯 You can now login with:');
      console.log('   Username: Employee1');
      console.log('   Password: password');
      console.log('   URL: https://dmudms-next.vercel.app/auth/signin');
      
    } else {
      console.log('❌ Employee1 not found');
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from PRODUCTION MongoDB');
    
  } catch (error) {
    console.error('❌ Error restoring Employee1 password:', error);
  }
}

restoreEmployee1Password();