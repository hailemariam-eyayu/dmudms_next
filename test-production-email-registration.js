// Test production email registration issue
console.log('🔍 Testing Production Email Registration Issue...\n');

// The issue analysis based on the context:
console.log('📊 Issue Analysis:');
console.log('✅ Password reset emails work correctly');
console.log('❌ New employee registration emails do not work');
console.log('✅ Test emails work correctly');
console.log('');

console.log('🔍 Key Differences to Investigate:');
console.log('1. Email service configuration - same for all');
console.log('2. Email sending logic - same for all');
console.log('3. Environment variables - same for all');
console.log('4. Recipient email handling - same for all');
console.log('');

console.log('🧪 Hypothesis:');
console.log('The issue might be in the employee registration API flow, not the email service itself.');
console.log('');

console.log('🔧 Debugging Steps:');
console.log('1. Check if the email sending code is actually reached in employee registration');
console.log('2. Check if there are any errors thrown during employee creation that prevent email sending');
console.log('3. Check if the employee data structure is different from expected');
console.log('4. Check if there are any async/await issues in the employee registration flow');
console.log('');

console.log('📝 Recommended Actions:');
console.log('1. Add more detailed logging to employee registration API');
console.log('2. Add try-catch around the entire email sending block');
console.log('3. Log the exact email data being passed to sendWelcomeEmail');
console.log('4. Check if the employee creation is successful before attempting email');
console.log('');

console.log('🎯 Next Steps:');
console.log('- Update employee registration API with enhanced logging');
console.log('- Test with a new employee registration');
console.log('- Check Vercel function logs for detailed error messages');