const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

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

async function addEdenAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Hash the password 'password' 
    const hashedPassword = await bcrypt.hash('password', 12);
    console.log('🔐 Password hashed successfully');

    // New admin user data
    const newAdmin = {
      employee_id: 'Eden',
      first_name: 'Eden',
      last_name: 'Haile Eyayu',
      email: 'hailemariameyayu@gmail.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      password: hashedPassword
    };

    console.log('📝 Adding Eden admin user...');

    try {
      const result = await Employee.findOneAndUpdate(
        { employee_id: newAdmin.employee_id },
        {
          ...newAdmin,
          updated_at: new Date()
        },
        { 
          upsert: true, 
          new: true,
          runValidators: true
        }
      );

      console.log(`✅ ${newAdmin.employee_id} (${newAdmin.role}) - Created/Updated successfully`);
      console.log(`📧 Email: ${newAdmin.email}`);
      console.log(`👤 Full Name: ${newAdmin.first_name} ${newAdmin.last_name}`);
    } catch (error) {
      console.error(`❌ Error adding ${newAdmin.employee_id}:`, error.message);
    }

    // Verify the admin users
    console.log('\n📊 Verifying admin users...');
    const adminUsers = await Employee.find({ role: 'ADMIN' }, {
      employee_id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      role: 1,
      status: 1,
      _id: 0
    }).sort({ employee_id: 1 });

    console.log('\n📋 Admin users in database:');
    console.table(adminUsers.map(emp => ({
      ID: emp.employee_id,
      Name: `${emp.first_name} ${emp.last_name}`,
      Email: emp.email,
      Role: emp.role,
      Status: emp.status
    })));

    console.log('\n✅ Eden admin user added successfully!');
    console.log(`📈 Total admin users: ${adminUsers.length}`);

  } catch (error) {
    console.error('❌ Error adding Eden admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addEdenAdmin();