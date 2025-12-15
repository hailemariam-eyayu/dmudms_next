const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Import the exact Employee model structure
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

// Simulate the exact mongoDataStore.updateEmployee method
class TestMongoDataStore {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await mongoose.connect(MONGODB_URI);
    this.initialized = true;
  }

  async updateEmployee(employeeId, updates) {
    await this.init();
    const Employee = mongoose.model('Employee', EmployeeSchema);
    
    console.log(`🔄 Updating employee ${employeeId} with:`, JSON.stringify(updates, null, 2));
    
    try {
      const result = await Employee.findOneAndUpdate(
        { employee_id: employeeId },
        updates,
        { new: true, runValidators: true }
      ).lean();
      
      console.log('✅ Update successful:', result ? 'Employee found and updated' : 'Employee not found');
      return result;
    } catch (error) {
      console.error('❌ Update failed:', error.message);
      if (error.errors) {
        console.error('Validation errors:', Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`));
      }
      throw error;
    }
  }

  async getEmployee(employeeId) {
    await this.init();
    const Employee = mongoose.model('Employee', EmployeeSchema);
    return await Employee.findOne({ employee_id: employeeId }).select('+password').lean();
  }
}

async function testAPIUpdate() {
  try {
    console.log('🧪 Testing API update simulation...');
    
    const mongoDataStore = new TestMongoDataStore();
    
    // Test the exact scenario from the profile page
    const employeeId = 'Eden';
    
    // First get the employee (like the API does)
    console.log('\n1️⃣ Getting employee...');
    const employee = await mongoDataStore.getEmployee(employeeId);
    if (!employee) {
      console.log('❌ Employee not found');
      return;
    }
    console.log('✅ Employee found:', employee.employee_id);
    
    // Test different update scenarios that might come from the frontend
    const testUpdates = [
      {
        name: 'Basic profile update (from form)',
        data: {
          first_name: 'Eden Updated',
          last_name: 'Haile Eyayu Updated',
          email: 'hailemariameyayu@gmail.com',
          phone: '123-456-7890',
          department: 'IT Department'
        }
      },
      {
        name: 'Partial update (only phone)',
        data: {
          phone: '987-654-3210'
        }
      },
      {
        name: 'Update with empty optional fields',
        data: {
          first_name: 'Eden',
          last_name: 'Haile Eyayu',
          email: 'hailemariameyayu@gmail.com',
          phone: '',
          department: ''
        }
      },
      {
        name: 'Update with null values',
        data: {
          phone: null,
          department: null
        }
      }
    ];
    
    for (let i = 0; i < testUpdates.length; i++) {
      const test = testUpdates[i];
      console.log(`\n${i + 2}️⃣ Testing: ${test.name}`);
      
      try {
        // Simulate the API route logic: remove sensitive fields
        const { password, employee_id, role, status, ...allowedUpdates } = test.data;
        
        console.log('Allowed updates:', JSON.stringify(allowedUpdates, null, 2));
        
        const updatedEmployee = await mongoDataStore.updateEmployee(employeeId, allowedUpdates);
        
        if (updatedEmployee) {
          console.log('✅ API simulation successful');
          // Simulate removing password from response
          const { password: _, ...employeeData } = updatedEmployee;
          console.log('Response data keys:', Object.keys(employeeData));
        } else {
          console.log('❌ Employee not found during update');
        }
        
      } catch (error) {
        console.error(`❌ API simulation failed: ${error.message}`);
        
        // This is what would cause the "Internal server error"
        console.log('🚨 This would result in HTTP 500 Internal Server Error');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testAPIUpdate();