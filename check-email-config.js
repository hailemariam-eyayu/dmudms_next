// Check email configuration and debug the issue
console.log('🔍 Checking Email Configuration...\n');

// Check environment variables
console.log('📧 Email Environment Variables:');
console.log('EMAIL_ENABLED:', process.env.EMAIL_ENABLED);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('EMAIL_SERVER_HOST:', process.env.EMAIL_SERVER_HOST);
console.log('EMAIL_SERVER_PORT:', process.env.EMAIL_SERVER_PORT);
console.log('EMAIL_SERVER_USER:', process.env.EMAIL_SERVER_USER ? '***configured***' : 'NOT SET');
console.log('EMAIL_SERVER_PASSWORD:', process.env.EMAIL_SERVER_PASSWORD ? '***configured***' : 'NOT SET');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

console.log('\n🔍 Analysis:');

if (process.env.EMAIL_ENABLED !== 'true') {
  console.log('❌ EMAIL_ENABLED is not set to "true" - emails will be in mock mode');
} else {
  console.log('✅ EMAIL_ENABLED is set to "true"');
}

if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
  console.log('❌ Email credentials are missing');
} else {
  console.log('✅ Email credentials are configured');
}

// Test the email service logic
console.log('\n🧪 Testing Email Service Logic:');

// Simulate the conditions from employee registration
const testEmployeeData = {
  first_name: 'Test',
  last_name: 'Employee',
  email: 'hailemariameyayu2012@gmail.com',
  employee_id: 'TEST001'
};

const generatedPassword = `${testEmployeeData.last_name}1234abcd#`;

console.log('Generated password:', generatedPassword);
console.log('Has generatedPassword:', !!generatedPassword);
console.log('Has email:', !!testEmployeeData.email);
console.log('Should send email:', !!(generatedPassword && testEmployeeData.email));

// Check the email service instantiation
try {
  const { emailService } = require('./src/lib/emailService.ts');
  console.log('✅ Email service imported successfully');
} catch (error) {
  console.log('❌ Email service import failed:', error.message);
}