const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Employee schema matching the model exactly
const EmployeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'directorate', 'coordinator', 'proctor', 'security_guard', 'registrar', 'maintainer'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  password: {
    type: String,
    select: false
  },
  profile_image: {
    type: String,
    trim: true
  },
  profile_image_public_id: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

async function debugEmployeeUpdate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully');
    
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    // Test updating Eden's profile
    console.log('\n🔍 Testing Eden profile update...');
    
    const employeeId = 'Eden';
    
    // First, get the current employee data
    const currentEmployee = await Employee.findOne({ employee_id: employeeId }).lean();
    if (!currentEmployee) {
      console.log('❌ Employee not found');
      return;
    }
    
    console.log('✅ Current employee data:');
    console.log(JSON.stringify(currentEmployee, null, 2));
    
    // Test different types of updates
    const testUpdates = [
      {
        name: 'Simple field update',
        data: { phone: '123-456-7890' }
      },
      {
        name: 'Name update',
        data: { first_name: 'Eden Updated', last_name: 'Haile Eyayu Updated' }
      },
      {
        name: 'Department update',
        data: { department: 'IT Department' }
      },
      {
        name: 'Multiple fields',
        data: { 
          phone: '987-654-3210',
          department: 'Administration',
          profile_image: 'https://example.com/image.jpg'
        }
      }
    ];
    
    for (const test of testUpdates) {
      try {
        console.log(`\n📝 Testing: ${test.name}`);
        console.log('Update data:', JSON.stringify(test.data, null, 2));
        
        const updatedEmployee = await Employee.findOneAndUpdate(
          { employee_id: employeeId },
          test.data,
          { new: true, runValidators: true }
        ).lean();
        
        if (updatedEmployee) {
          console.log('✅ Update successful');
          console.log('Updated fields:', Object.keys(test.data).map(key => `${key}: ${updatedEmployee[key]}`).join(', '));
        } else {
          console.log('❌ Update failed - employee not found');
        }
        
      } catch (error) {
        console.error(`❌ Update failed for ${test.name}:`, error.message);
        if (error.errors) {
          console.error('Validation errors:', Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`));
        }
      }
    }
    
    // Test with invalid data to see what breaks
    console.log('\n🧪 Testing invalid updates...');
    
    const invalidTests = [
      {
        name: 'Invalid gender',
        data: { gender: 'other' }
      },
      {
        name: 'Invalid role',
        data: { role: 'invalid_role' }
      },
      {
        name: 'Invalid status',
        data: { status: 'invalid_status' }
      },
      {
        name: 'Empty required field',
        data: { first_name: '' }
      }
    ];
    
    for (const test of invalidTests) {
      try {
        console.log(`\n🚫 Testing invalid: ${test.name}`);
        
        const result = await Employee.findOneAndUpdate(
          { employee_id: employeeId },
          test.data,
          { new: true, runValidators: true }
        ).lean();
        
        console.log('⚠️ Invalid update unexpectedly succeeded');
        
      } catch (error) {
        console.log(`✅ Invalid update correctly rejected: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the debug
debugEmployeeUpdate();