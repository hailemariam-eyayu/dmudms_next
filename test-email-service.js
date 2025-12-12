// Test script for email service functionality
const { emailService } = require('./src/lib/emailService.ts');

async function testEmailService() {
  console.log('🧪 Testing Email Service...\n');

  // Test 1: Welcome Email
  console.log('📧 Testing Welcome Email...');
  const welcomeResult = await emailService.sendWelcomeEmail({
    name: 'Test User',
    userId: 'TEST001',
    password: 'test123',
    loginUrl: 'https://dmudms-next.vercel.app/auth/signin',
    userType: 'student'
  });
  console.log('Welcome Email Result:', welcomeResult ? '✅ Success' : '❌ Failed');

  // Test 2: Password Reset Email
  console.log('\n📧 Testing Password Reset Email...');
  const resetResult = await emailService.sendPasswordResetEmail({
    name: 'Test User',
    userId: 'TEST001',
    password: 'newpass123',
    loginUrl: 'https://dmudms-next.vercel.app/auth/signin',
    userType: 'employee'
  });
  console.log('Password Reset Email Result:', resetResult ? '✅ Success' : '❌ Failed');

  // Test 3: General Email Test
  console.log('\n📧 Testing General Email Service...');
  const testResult = await emailService.testEmailService();
  console.log('General Email Test Result:', testResult ? '✅ Success' : '❌ Failed');

  console.log('\n🏁 Email Service Test Complete!');
}

// Run the test
testEmailService().catch(console.error);