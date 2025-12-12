// Test Production User Registration with Email
// This script will register a new user and test email sending

const https = require('https');

const PRODUCTION_URL = 'dmudms-next.vercel.app';
const TEST_EMAIL = 'lovewithme2932@gmail.com';

// Function to make HTTPS requests
function makeRequest(path, method = 'GET', data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: PRODUCTION_URL,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Production Registration Test Script',
        'Accept': 'application/json'
      }
    };

    if (cookies) {
      options.headers['Cookie'] = cookies;
    }

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ 
            status: res.statusCode, 
            data: parsed, 
            headers: res.headers,
            cookies: res.headers['set-cookie'] || []
          });
        } catch (error) {
          resolve({ 
            status: res.statusCode, 
            data: responseData, 
            headers: res.headers,
            cookies: res.headers['set-cookie'] || []
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testProductionRegistration() {
  console.log('🚀 Testing Production User Registration with Email');
  console.log('=================================================\n');

  try {
    // Test 1: Register a new employee
    console.log('📝 Step 1: Registering new employee...');
    console.log(`📧 Email: ${TEST_EMAIL}`);
    
    const employeeData = {
      employee_id: `TEST${Date.now()}`,
      first_name: 'Test',
      last_name: 'Employee',
      email: TEST_EMAIL,
      gender: 'male',
      role: 'proctor',
      phone: '+251-911-123456',
      department: 'IT Testing',
      status: 'active'
    };

    console.log('📊 Employee Data:');
    console.log(JSON.stringify(employeeData, null, 2));

    const registrationResponse = await makeRequest('/api/employees', 'POST', employeeData);
    
    console.log(`\n📊 Registration Response Status: ${registrationResponse.status}`);
    console.log('📋 Registration Response:');
    console.log(JSON.stringify(registrationResponse.data, null, 2));

    if (registrationResponse.status === 200 && registrationResponse.data.success) {
      console.log('\n✅ Employee registration successful!');
      
      if (registrationResponse.data.generatedPassword) {
        console.log(`🔑 Generated Password: ${registrationResponse.data.generatedPassword}`);
      }
      
      if (registrationResponse.data.emailSent) {
        console.log('📧 Email was sent successfully!');
        console.log(`📬 Check ${TEST_EMAIL} for welcome email`);
      } else {
        console.log('⚠️ Email was not sent - check email service configuration');
      }
    } else {
      console.log('❌ Employee registration failed');
      console.log('🔧 Possible issues:');
      console.log('   - Duplicate employee ID');
      console.log('   - Missing required fields');
      console.log('   - Server error');
    }

    // Test 2: Register a new student
    console.log('\n📝 Step 2: Registering new student...');
    
    const studentData = {
      student_id: `STU${Date.now()}`,
      first_name: 'Test',
      second_name: 'Middle',
      last_name: 'Student',
      email: TEST_EMAIL,
      gender: 'male',
      batch: '2024',
      disability_status: 'none',
      status: 'active'
    };

    console.log('📊 Student Data:');
    console.log(JSON.stringify(studentData, null, 2));

    const studentResponse = await makeRequest('/api/students', 'POST', studentData);
    
    console.log(`\n📊 Student Registration Response Status: ${studentResponse.status}`);
    console.log('📋 Student Registration Response:');
    console.log(JSON.stringify(studentResponse.data, null, 2));

    if (studentResponse.status === 200 && studentResponse.data.success) {
      console.log('\n✅ Student registration successful!');
      
      if (studentResponse.data.generatedPassword) {
        console.log(`🔑 Generated Password: ${studentResponse.data.generatedPassword}`);
      }
      
      if (studentResponse.data.emailSent) {
        console.log('📧 Email was sent successfully!');
        console.log(`📬 Check ${TEST_EMAIL} for welcome email`);
      } else {
        console.log('⚠️ Email was not sent - check email service configuration');
      }
    } else {
      console.log('❌ Student registration failed');
    }

    // Test 3: Test email service directly
    console.log('\n📝 Step 3: Testing email service directly...');
    
    const emailTestData = {
      testType: 'welcome'
    };

    const emailTestResponse = await makeRequest('/api/admin/test-email', 'POST', emailTestData);
    
    console.log(`\n📊 Email Test Response Status: ${emailTestResponse.status}`);
    console.log('📋 Email Test Response:');
    console.log(JSON.stringify(emailTestResponse.data, null, 2));

    if (emailTestResponse.status === 200 && emailTestResponse.data.success) {
      console.log('\n✅ Email service test successful!');
      console.log(`📧 Mode: ${emailTestResponse.data.mode}`);
      console.log(`📬 Email From: ${emailTestResponse.data.emailFrom}`);
      
      if (emailTestResponse.data.mode === 'Live') {
        console.log('🎉 Email service is in LIVE mode - real emails are being sent!');
      } else {
        console.log('⚠️ Email service is still in MOCK mode');
      }
    } else {
      console.log('❌ Email service test failed');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if production site is accessible');
    console.log('2. Verify environment variables are set correctly');
    console.log('3. Ensure application was redeployed after setting env vars');
    console.log('4. Check Vercel function logs for detailed errors');
  }

  console.log('\n📋 Manual Verification Steps:');
  console.log(`1. Check ${TEST_EMAIL} inbox for welcome emails`);
  console.log('2. Go to https://dmudms-next.vercel.app/admin/settings');
  console.log('3. Check email service status in Notifications section');
  console.log('4. Use test buttons to verify email sending');

  console.log('\n📊 Expected Email Content:');
  console.log('✅ Professional HTML template with DMU branding');
  console.log('✅ Login credentials (User ID + Password)');
  console.log('✅ Direct login link to the system');
  console.log('✅ Security recommendations');
  console.log('✅ Mobile-responsive design');

  console.log('\n🎯 Success Indicators:');
  console.log('✅ Registration responses show emailSent: true');
  console.log('✅ Email service test shows mode: "Live"');
  console.log('✅ Welcome emails received in inbox');
  console.log('✅ Emails contain correct login credentials');

  console.log('\n=================================================');
  console.log('🎉 Production email test completed!');
}

// Run the test
testProductionRegistration().catch(console.error);