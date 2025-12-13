// Test email service directly to isolate the issue
console.log('🔍 Testing Email Service Directly...\n');

// Test the email service configuration
console.log('📧 Environment Check:');
console.log('EMAIL_ENABLED:', process.env.EMAIL_ENABLED || 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
console.log('EMAIL_SERVER_HOST:', process.env.EMAIL_SERVER_HOST || 'NOT SET');
console.log('EMAIL_SERVER_PORT:', process.env.EMAIL_SERVER_PORT || 'NOT SET');
console.log('EMAIL_SERVER_USER:', process.env.EMAIL_SERVER_USER ? '***SET***' : 'NOT SET');
console.log('EMAIL_SERVER_PASSWORD:', process.env.EMAIL_SERVER_PASSWORD ? '***SET***' : 'NOT SET');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET');

console.log('\n🧪 Key Findings from Analysis:');
console.log('1. Password reset emails work - this means email service is functional');
console.log('2. Test emails work - this means email configuration is correct');
console.log('3. Employee registration emails fail - this suggests an issue in the registration flow');
console.log('');

console.log('🔍 Possible Issues:');
console.log('1. Employee creation might be failing before email is sent');
console.log('2. There might be an exception in the employee registration that prevents email sending');
console.log('3. The email data structure might be different for employee registration');
console.log('4. There might be a timing issue with async operations');
console.log('');

console.log('🎯 Solution Strategy:');
console.log('1. Enhanced logging has been added to both employee registration API and email service');
console.log('2. The next step is to test employee registration and check the logs');
console.log('3. Compare the logs between successful password reset and failed registration');
console.log('');

console.log('📝 Test Instructions:');
console.log('1. Deploy the updated code with enhanced logging');
console.log('2. Try to register a new employee');
console.log('3. Check Vercel function logs for detailed debug information');
console.log('4. Compare with password reset logs to identify the difference');