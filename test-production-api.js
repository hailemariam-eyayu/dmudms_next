// Test the actual production API to see what's happening
const https = require('https');

async function testProductionAPI() {
  console.log('🌐 TESTING PRODUCTION API ENDPOINTS');
  console.log('=' .repeat(80));
  
  // Test environment endpoint
  console.log('\n🔍 Testing /api/debug/environment...');
  try {
    const envResponse = await fetch('https://dmudms-next.vercel.app/api/debug/environment');
    const envData = await envResponse.json();
    
    if (envData.success) {
      console.log('✅ Environment data retrieved:');
      console.log(`   DEMO_MODE: ${envData.environment.DEMO_MODE}`);
      console.log(`   MONGODB_URI: ${envData.environment.MONGODB_URI ? envData.environment.MONGODB_URI.substring(0, 50) + '...' : 'Not set'}`);
      console.log(`   NEXTAUTH_URL: ${envData.environment.NEXTAUTH_URL}`);
    } else {
      console.log('❌ Failed to get environment data');
    }
  } catch (error) {
    console.log('❌ Error testing environment:', error.message);
  }
  
  // Test employees endpoint
  console.log('\n🔍 Testing /api/employees...');
  try {
    const empResponse = await fetch('https://dmudms-next.vercel.app/api/employees');
    const empData = await empResponse.json();
    
    if (empData.success && empData.data) {
      console.log(`✅ Found ${empData.data.length} employees:`);
      empData.data.slice(0, 5).forEach(emp => {
        console.log(`   ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
      });
      
      // Check for Employee1 specifically
      const employee1 = empData.data.find(e => e.employee_id === 'Employee1');
      if (employee1) {
        console.log('\n✅ Employee1 found in API response:');
        console.log(`   Name: ${employee1.first_name} ${employee1.last_name}`);
        console.log(`   Role: ${employee1.role}`);
        console.log(`   Status: ${employee1.status}`);
      } else {
        console.log('\n❌ Employee1 NOT found in API response');
        console.log('   Available employee IDs:');
        empData.data.forEach(emp => console.log(`      ${emp.employee_id}`));
      }
    } else {
      console.log('❌ Failed to get employees data:', empData.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Error testing employees API:', error.message);
  }
  
  // Test authentication with Employee1
  console.log('\n🔍 Testing authentication with Employee1...');
  try {
    const authResponse = await fetch('https://dmudms-next.vercel.app/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Employee1',
        password: 'password',
        csrfToken: 'test'
      })
    });
    
    console.log(`   Response status: ${authResponse.status}`);
    
    if (authResponse.status === 200) {
      console.log('✅ Authentication successful');
    } else if (authResponse.status === 401) {
      console.log('❌ Authentication failed - 401 Unauthorized');
      const errorText = await authResponse.text();
      console.log(`   Error: ${errorText.substring(0, 200)}`);
    } else {
      console.log(`❌ Unexpected response: ${authResponse.status}`);
    }
  } catch (error) {
    console.log('❌ Error testing authentication:', error.message);
  }
  
  // Test students endpoint
  console.log('\n🔍 Testing /api/students...');
  try {
    const studResponse = await fetch('https://dmudms-next.vercel.app/api/students');
    const studData = await studResponse.json();
    
    if (studData.success && studData.data) {
      console.log(`✅ Found ${studData.data.length} students:`);
      studData.data.slice(0, 3).forEach(student => {
        console.log(`   ${student.student_id} - ${student.first_name} ${student.last_name}`);
      });
    } else {
      console.log('❌ Failed to get students data:', studData.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Error testing students API:', error.message);
  }
  
  console.log('\n📋 SUMMARY:');
  console.log('=' .repeat(80));
  console.log('If Employee1 exists in the API but authentication fails, the issue might be:');
  console.log('1. Password hashing mismatch');
  console.log('2. NextAuth configuration issue');
  console.log('3. Environment variable mismatch');
  console.log('4. Database connection caching');
  
  console.log('\n🎯 RECOMMENDED ACTIONS:');
  console.log('1. Check Vercel environment variables');
  console.log('2. Redeploy the application to clear any caches');
  console.log('3. Verify the MONGODB_URI in production matches the working database');
}

// Polyfill fetch for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

testProductionAPI().catch(console.error);