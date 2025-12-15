// Test direct API call to the employee update endpoint
const fetch = require('node-fetch');

async function testDirectAPICall() {
  try {
    console.log('🧪 Testing direct API call...');
    
    // First, we need to get a session token by logging in
    console.log('1️⃣ Attempting to sign in...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'Eden',
        password: 'password'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
      return;
    }
    
    // Get cookies from login response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies received:', cookies);
    
    // Now try to update the profile
    console.log('\n2️⃣ Attempting to update profile...');
    
    const updateData = {
      first_name: 'Eden Test',
      last_name: 'Haile Eyayu Test',
      email: 'hailemariameyayu@gmail.com',
      phone: '123-456-7890',
      department: 'Test Department'
    };
    
    const updateResponse = await fetch('http://localhost:3000/api/employees/Eden', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('Update response status:', updateResponse.status);
    console.log('Update response headers:', Object.fromEntries(updateResponse.headers.entries()));
    
    const responseText = await updateResponse.text();
    console.log('Update response body:', responseText);
    
    if (updateResponse.ok) {
      console.log('✅ Profile update successful!');
      try {
        const responseData = JSON.parse(responseText);
        console.log('Response data:', JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }
    } else {
      console.log('❌ Profile update failed');
      console.log('Status:', updateResponse.status);
      console.log('Response:', responseText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your Next.js development server is running on http://localhost:3000');
      console.log('   Run: npm run dev');
    }
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health', {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if development server is running...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Development server is not running or not responding');
    console.log('💡 Please start your Next.js development server:');
    console.log('   npm run dev');
    console.log('   Then run this test again.');
    return;
  }
  
  console.log('✅ Development server is running');
  await testDirectAPICall();
}

main();