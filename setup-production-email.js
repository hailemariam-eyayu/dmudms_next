// Production Email Setup Script
// This script helps you set up email service on Vercel production

console.log('🚀 Production Email Setup for DMUDMS');
console.log('=====================================\n');

console.log('📋 STEP 1: Gmail App Password Setup');
console.log('1. Go to: https://myaccount.google.com/');
console.log('2. Navigate to: Security → 2-Step Verification (enable if not already)');
console.log('3. Go to: Security → App passwords');
console.log('4. Generate app password for "Mail"');
console.log('5. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")');
console.log('');

console.log('📋 STEP 2: Vercel Environment Variables');
console.log('1. Go to: https://vercel.com/dashboard');
console.log('2. Select: dmudms-next project');
console.log('3. Go to: Settings → Environment Variables');
console.log('4. Add/Update these variables:');
console.log('');

const envVars = [
  {
    name: 'EMAIL_ENABLED',
    value: 'true',
    description: 'Enable real email sending'
  },
  {
    name: 'EMAIL_FROM',
    value: 'hailemariameyayu@gmail.com',
    description: 'From email address'
  },
  {
    name: 'EMAIL_SERVER_HOST',
    value: 'smtp.gmail.com',
    description: 'Gmail SMTP server'
  },
  {
    name: 'EMAIL_SERVER_PORT',
    value: '587',
    description: 'Gmail SMTP port'
  },
  {
    name: 'EMAIL_SERVER_USER',
    value: 'hailemariameyayu@gmail.com',
    description: 'Gmail username'
  },
  {
    name: 'EMAIL_SERVER_PASSWORD',
    value: 'YOUR_16_CHARACTER_APP_PASSWORD_HERE',
    description: 'Gmail App Password (replace with actual password)'
  }
];

console.log('Environment Variables to Set:');
console.log('┌─────────────────────────┬─────────────────────────────────────┬─────────────────────────────┐');
console.log('│ Variable Name           │ Value                               │ Description                 │');
console.log('├─────────────────────────┼─────────────────────────────────────┼─────────────────────────────┤');

envVars.forEach(env => {
  const name = env.name.padEnd(23);
  const value = env.value.padEnd(35);
  const desc = env.description.padEnd(27);
  console.log(`│ ${name} │ ${value} │ ${desc} │`);
});

console.log('└─────────────────────────┴─────────────────────────────────────┴─────────────────────────────┘');
console.log('');

console.log('📋 STEP 3: Deploy and Test');
console.log('1. After setting environment variables, redeploy the application');
console.log('2. Go to: https://dmudms-next.vercel.app/admin/settings');
console.log('3. Scroll to "Notifications" section');
console.log('4. Click "Test Welcome Email" or "Test Reset Email"');
console.log('5. Check the result - should show "Live" mode instead of "Mock"');
console.log('');

console.log('📋 STEP 4: Verify Email Integration');
console.log('1. Create a test employee with your email address');
console.log('2. Check if welcome email is received');
console.log('3. Reset password and check if reset email is received');
console.log('4. Upload CSV with test data and verify emails are sent');
console.log('');

console.log('🔧 Troubleshooting:');
console.log('- If emails still in "Mock" mode: Check EMAIL_ENABLED is set to "true"');
console.log('- If "Invalid credentials": Verify Gmail App Password is correct');
console.log('- If "Connection refused": Check SMTP settings (smtp.gmail.com:587)');
console.log('- If emails go to spam: Ask recipients to mark as "Not Spam"');
console.log('');

console.log('📧 Email Integration Points:');
console.log('✅ Manual employee registration → Welcome email');
console.log('✅ Manual student registration → Welcome email');
console.log('✅ CSV employee upload → Welcome emails for all');
console.log('✅ CSV student upload → Welcome emails for all');
console.log('✅ Password reset → Reset notification email');
console.log('');

console.log('🎯 Expected Email Content:');
console.log('- Professional HTML templates with DMU branding');
console.log('- Login credentials (User ID + Password)');
console.log('- Direct login link to the system');
console.log('- Security recommendations');
console.log('- Mobile-responsive design');
console.log('');

console.log('📊 Current Status Check:');
console.log('After setup, the admin settings page should show:');
console.log('- Email Service Status: "Live" (not "Mock Mode")');
console.log('- Configuration: hailemariameyayu@gmail.com via Gmail SMTP');
console.log('- Test buttons should successfully send emails');
console.log('');

console.log('🚨 IMPORTANT SECURITY NOTES:');
console.log('- Never commit Gmail App Password to version control');
console.log('- Use App Passwords, not your regular Gmail password');
console.log('- Enable 2-Step Verification on your Gmail account');
console.log('- Monitor email sending for any suspicious activity');
console.log('');

console.log('✅ Once configured, emails will be automatically sent for:');
console.log('   • New user registrations (manual and CSV)');
console.log('   • Password resets');
console.log('   • All with professional templates and proper formatting');

console.log('\n🎉 Email service is ready to go live!');
console.log('=====================================');