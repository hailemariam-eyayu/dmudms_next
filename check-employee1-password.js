// Check Employee1's current password in production
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

async function checkEmployee1Password() {
  try {
    console.log('🌐 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to PRODUCTION MongoDB');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    const employee1 = await Employee.findOne({ employee_id: 'Employee1' }).select('+password');
    
    if (employee1) {
      console.log('✅ Employee1 found:');
      console.log(`   Name: ${employee1.first_name} ${employee1.last_name}`);
      console.log(`   Role: ${employee1.role}`);
      console.log(`   Phone: ${employee1.phone || 'Not set'}`);
      console.log(`   Password exists: ${!!employee1.password}`);
      console.log(`   Password length: ${employee1.password ? employee1.password.length : 0}`);
      
      if (employee1.password) {
        // Test if password is "password"
        const isValidPassword = await bcrypt.compare('password', employee1.password);
        console.log(`   Password "password" works: ${isValidPassword}`);
        
        // Check if it's a plain text password (which would be wrong)
        const isPlainText = employee1.password === 'password';
        console.log(`   Password is plain text: ${isPlainText}`);
        
        if (isPlainText) {
          console.log('⚠️  PASSWORD IS STORED AS PLAIN TEXT - SECURITY ISSUE!');
        }
      } else {
        console.log('❌ No password set for Employee1');
      }
    } else {
      console.log('❌ Employee1 not found');
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from PRODUCTION MongoDB');
    
  } catch (error) {
    console.error('❌ Error checking Employee1 password:', error);
  }
}

checkEmployee1Password();