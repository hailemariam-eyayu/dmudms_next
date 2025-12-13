// Debug script to test employee registration email issue
const https = require('https');
const querystring = require('querystring');

// Simple fetch replacement for Node.js
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          headers: {
            get: (name) => res.headers[name.toLowerCase()]
          },
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data)
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

const PRODUCTION_URL = 'https://dmudms-next.vercel.app';

async function testEmployeeRegistration() {
  console.log('🔍 Testing Employee Registration Email Issue...\n');

  try {
    // First, login as admin to get session
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${PRODUCTION_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Employee1',
        password: 'password'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginResponse.status);
      return;
    }

    // Get session cookie
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('✅ Login successful');

    // Test employee creation
    console.log('\n2. Creating test employee...');
    const testEmployee = {
      employee_id: `TEST${Date.now()}`,
      first_name: 'Debug',
      last_name: 'Test',
      email: 'hailemariameyayu2012@gmail.com', // Use the test email
      gender: 'male',
      role: 'proctor',
      status: 'active',
      phone: '+251-911-123456',
      department: 'IT'
    };

    const createResponse = await fetch(`${PRODUCTION_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(testEmployee)
    });

    const createResult = await createResponse.json();
    console.log('📊 Create Response Status:', createResponse.status);
    console.log('📊 Create Response Body:', JSON.stringify(createResult, null, 2));

    if (createResult.success) {
      console.log('✅ Employee created successfully');
      console.log('📧 Email sent:', createResult.emailSent ? 'YES' : 'NO');
      console.log('🔑 Generated password:', createResult.generatedPassword);
    } else {
      console.log('❌ Employee creation failed:', createResult.error);
    }

    // Test email service directly
    console.log('\n3. Testing email service directly...');
    const emailTestResponse = await fetch(`${PRODUCTION_URL}/api/admin/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify({
        testType: 'welcome'
      })
    });

    const emailTestResult = await emailTestResponse.json();
    console.log('📧 Email Test Response:', JSON.stringify(emailTestResult, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEmployeeRegistration();