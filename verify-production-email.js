// Production Email Verification Script
// Run this to test email service on production

const https = require('https');

const PRODUCTION_URL = 'https://dmudms-next.vercel.app';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'dmudms-next.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Production Email Test Script'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
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

async function verifyEmailService() {
  console.log('🔍 Verifying Production Email Service');
  console.log('=====================================\n');

  try {
    console.log('📧 Testing Email Service API...');
    
    // Test the email service endpoint
    const testData = {
      testType: 'general'
    };

    const response = await makeRequest('/api/admin/test-email', 'POST', testData);
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log('📋 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.success) {
      console.log('\n✅ Email Service API is working!');
      
      if (response.data.mode === 'Live') {
        console.log('🎉 Email service is in LIVE mode - real emails will be sent!');
        console.log(`📧 Email configuration: ${response.data.emailFrom}`);
      } else {
        console.log('⚠️ Email service is still in MOCK mode');
        console.log('🔧 Check environment variables:');
        console.log('   - EMAIL_ENABLED should be "true"');
        console.log('   - EMAIL_SERVER_PASSWORD should be your Gmail App Password');
      }
    } else {
      console.log('❌ Email Service API test failed');
      console.log('🔧 Possible issues:');
      console.log('   - Environment variables not set correctly');
      console.log('   - Gmail App Password incorrect');
      console.log('   - SMTP configuration issues');
    }

  } catch (error) {
    console.error('❌ Error testing email service:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if the production site is accessible');
    console.log('2. Verify environment variables are set in Vercel');
    console.log('3. Check if the application has been redeployed after setting variables');
  }

  console.log('\n📋 Manual Verification Steps:');
  console.log('1. Go to: https://dmudms-next.vercel.app/admin/settings');
  console.log('2. Login with: Employee1 / password');
  console.log('3. Scroll to "Notifications" section');
  console.log('4. Check email service status');
  console.log('5. Use test buttons to send test emails');

  console.log('\n🧪 End-to-End Test:');
  console.log('1. Create a test employee with your email');
  console.log('2. Check if welcome email is received');
  console.log('3. Reset password and verify reset email');

  console.log('\n📊 Expected Results:');
  console.log('✅ Email Service Status: "Live" (not "Mock Mode")');
  console.log('✅ Test emails should be sent successfully');
  console.log('✅ Welcome emails sent for new registrations');
  console.log('✅ Reset emails sent for password resets');

  console.log('\n=====================================');
}

// Run the verification
verifyEmailService().catch(console.error);