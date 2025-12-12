# Email Service Setup Guide

## Current Status
✅ Email service is implemented and integrated into the system
✅ Email templates are created for welcome and password reset emails
✅ APIs are configured to send emails on user registration and password reset
⚠️ Email service is currently in MOCK MODE (not sending real emails)

## To Enable Real Email Sending

### Step 1: Gmail App Password Setup
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (enable if not already enabled)
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character app password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update Environment Variables

#### For Production (Vercel):
1. Go to Vercel Dashboard → dmudms-next → Settings → Environment Variables
2. Update these variables:
```
EMAIL_ENABLED=true
EMAIL_FROM=hailemariameyayu@gmail.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=hailemariameyayu@gmail.com
EMAIL_SERVER_PASSWORD=your_16_character_app_password_here
```

#### For Local Development:
Update `.env.local` file:
```
EMAIL_ENABLED=true
EMAIL_SERVER_PASSWORD=your_16_character_app_password_here
```

### Step 3: Test Email Service
Run the test script:
```bash
cd dormitory-management-nextjs
node test-email-service.js
```

## Email Integration Points

### 1. User Registration
- **File**: `src/app/api/employees/route.ts` and `src/app/api/students/route.ts`
- **Trigger**: When new employee or student is created
- **Email Type**: Welcome email with login credentials
- **Condition**: Only sent if user has email address

### 2. Password Reset
- **Files**: 
  - `src/app/api/employees/[id]/reset-password/route.ts`
  - `src/app/api/students/[id]/reset-password/route.ts`
- **Trigger**: When admin resets user password
- **Email Type**: Password reset notification
- **Condition**: Only sent if user has email address

## Email Templates

### Welcome Email Features:
- Professional HTML template with DMU branding
- Contains login credentials (User ID and Password)
- Direct login link
- Security recommendations
- Mobile-friendly design

### Password Reset Email Features:
- Security-focused design with red theme
- New password information
- Security warnings
- Immediate action prompts

## Security Notes

1. **App Passwords**: Use Gmail App Passwords, not regular account passwords
2. **Environment Variables**: Never commit real passwords to version control
3. **Email Validation**: System validates email addresses before sending
4. **Error Handling**: Failed email sends are logged but don't break user creation
5. **Mock Mode**: Development uses mock mode to prevent accidental email sends

## Troubleshooting

### Common Issues:
1. **"Invalid credentials"**: Check Gmail App Password is correct
2. **"Connection refused"**: Verify SMTP settings (host: smtp.gmail.com, port: 587)
3. **"Authentication failed"**: Ensure 2-Step Verification is enabled on Gmail
4. **Emails not sending**: Check EMAIL_ENABLED is set to "true"

### Debug Steps:
1. Check environment variables are set correctly
2. Verify Gmail App Password is active
3. Test with the provided test script
4. Check server logs for detailed error messages

## Current Configuration

**Email Address**: hailemariameyayu@gmail.com (from Laravel project)
**SMTP Provider**: Gmail
**Current Mode**: Mock (logs to console instead of sending)
**Integration**: Fully implemented in registration and password reset flows

## Next Steps

1. Set up Gmail App Password
2. Update Vercel environment variables
3. Test email functionality
4. Monitor email delivery in production
5. Consider adding email delivery status tracking