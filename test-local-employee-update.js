// Test the employee update locally
const fetch = require('node-fetch');

async function testLocalEmployeeUpdate() {
  try {
    console.log('🧪 Testing local employee update...');
    
    // Test data that would be sent from the employee management form
    const updateData = {
      first_name: 'Eden Test',
      last_name: 'Haile Eyayu Test',
      email: 'hailemariameyayu@gmail.com',
      gender: 'male',
      role: 'admin',
      status: 'active',
      phone: '123-456-7890',
      department: 'Test Department'
    };
    
    console.log('📝 Update data:', JSON.stringify(updateData, null, 2));
    
    // Try to update Employee1 (this is what's failing)
    console.log('\n🔄 Making PUT request to /api/employees/Employee1...');
    
    const response = await fetch('http://localhost:3000/api/employees/Employee1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real scenario, you'd need authentication cookies
        // But this will help us see what error we get
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Response body:', responseText);
    
    if (response.ok) {
      console.log('✅ Update successful!');
      try {
        const responseData = JSON.parse(responseText);
        console.log('📋 Parsed response:', JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.log('⚠️ Response is not JSON');
      }
    } else {
      console.log('❌ Update failed');
      console.log('Status:', response.status, response.statusText);
      
      // Try to parse error response
      try {
        const errorData = JSON.parse(responseText);
        console.log('📋 Error details:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('📄 Raw error response:', responseText);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your Next.js development server is running:');
      console.log('   npm run dev');
    }
  }
}

// Also test a simple GET request to see if the API is working
async function testGetEmployee() {
  try {
    console.log('\n🔍 Testing GET request to /api/employees/Employee1...');
    
    const response = await fetch('http://localhost:3000/api/employees/Employee1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📊 GET Response status:', response.status);
    const responseText = await response.text();
    console.log('📄 GET Response:', responseText);
    
  } catch (error) {
    console.error('❌ GET test failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting local API tests...\n');
  
  // Test GET first
  await testGetEmployee();
  
  // Then test PUT
  await testLocalEmployeeUpdate();
  
  console.log('\n✅ Tests completed');
  console.log('\n💡 Check your development server console for detailed logs!');
}

main();