// Simple script to check email service status
console.log('🔍 Checking Email Service Status...\n');

// Check environment variables
const emailEnabled = process.env.EMAIL_ENABLED;
const emailFrom = process.env.EMAIL_FROM;
const emailUser = process.env.EMAIL_SERVER_USER;
const emailPassword = process.env.EMAIL_SERVER_PASSWORD;

console.log('📧 Email Configuration:');
console.log(`EMAIL_ENABLED: ${emailEnabled || 'NOT SET'}`);
console.log(`EMAIL_FROM: ${emailFrom || 'NOT SET'}`);
console.log(`EMAIL_SERVER_USER: ${emailUser || 'NOT SET'}`);
console.log(`EMAIL_SERVER_PASSWORD: ${emailPassword ? (emailPassword.includes('your_') ? '❌ PLACEHOLDER' : '✅ SET') : '❌ NOT SET'}`);

console.log('\n🎯 Current Status:');
if (emailEnabled === 'true') {
  if (emailPassword && !emailPassword.includes('your_')) {
    console.log('✅ Email service is ENABLED and configured');
    console.log('📧 Real emails will be sent');
  } else {
    console.log('⚠️ Email service is ENABLED but password is not configured');
    console.log('📧 Emails will fail to send');
  }
} else {
  console.log('📝 Email service is in MOCK MODE');
  console.log('📧 Emails will be logged to console only');
}

console.log('\n🔧 To Enable Real Email Sending:');
console.log('1. Set EMAIL_ENABLED="true"');
console.log('2. Set EMAIL_SERVER_PASSWORD to your Gmail App Password');
console.log('3. Get Gmail App Password: https://myaccount.google.com/apppasswords');

console.log('\n📊 Integration Points:');
console.log('✅ Employee registration (manual & CSV)');
console.log('✅ Student registration (manual & CSV)');
console.log('✅ Password reset (employees & students)');
console.log('✅ Professional HTML email templates');

console.log('\n🧪 Test Email Service:');
console.log('- Go to /admin/settings');
console.log('- Use email test buttons');
console.log('- Create test user with your email');

console.log('\n' + '='.repeat(50));