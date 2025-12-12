# Production Email Setup Instructions

## Current Status ✅
- **Email Service**: Fully implemented and integrated
- **Templates**: Professional HTML templates for welcome and password reset emails
- **Integration**: Automatically sends emails on user registration and password reset
- **Mode**: Currently in MOCK MODE (logs to console, doesn't send real emails)

## Email Integration Points

### 1. User Registration
When new employees or students are created via:
- `/api/employees` (POST)
- `/api/students` (POST)

**Automatic Email Sent**: Welcome email with login credentials

### 2. Password Reset
When passwords are reset via:
- `/api/employees/[id]/reset-password` (POST)
- `/api/students/[id]/reset-password` (POST)

**Automatic Email Sent**: Password reset notification

## To Enable Real Email Sending

### Step 1: Gmail App Password Setup
1. **Go to Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification**: Security → 2-Step Verification
3. **Create App Password**: Security → App passwords → Mail
4. **Copy the 16-character password**: Example: `abcd efgh ijkl mnop`

### Step 2: Update Vercel Environment Variables
1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Project**: dmudms-next
3. **Go to Settings**: Settings → Environment Variables
4. **Update these variables**:

```
EMAIL_ENABLED=true
EMAIL_FROM=hailemariameyayu@gmail.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=hailemariameyayu@gmail.com
EMAIL_SERVER_PASSWORD=your_16_character_app_password_here
```

### Step 3: Redeploy Application
After updating environment variables, trigger a new deployment:
- Push any change to GitHub, or
- Use Vercel's "Redeploy" button

### Step 4: Test Email Service
1. **Go to Admin Settings**: https://dmudms-next.vercel.app/admin/settings
2. **Scroll to Notifications section**
3. **Click test buttons**: Test Welcome Email, Test Reset Email, Test Service
4. **Check results**: Should show "Live" mode instead of "Mock" mode

## Email Templates

### Welcome Email Features:
- **Subject**: "Welcome to DMUDMS - Your Account Details"
- **Content**: Login credentials, security tips, direct login link
- **Design**: Professional blue theme with DMU branding
- **Mobile**: Responsive design for all devices

### Password Reset Email Features:
- **Subject**: "DMUDMS - Password Reset Notification"
- **Content**: New password, security warnings, immediate action prompts
- **Design**: Security-focused red theme
- **Mobile**: Responsive design for all devices

## Security Features

1. **Conditional Sending**: Only sends if user has email address
2. **Error Handling**: Failed emails don't break user creation process
3. **App Passwords**: Uses secure Gmail App Passwords, not account passwords
4. **Environment Variables**: Sensitive data stored securely in Vercel
5. **Mock Mode**: Development environment uses mock mode to prevent accidental sends

## Testing Checklist

### Before Production:
- [ ] Gmail App Password created and tested
- [ ] Vercel environment variables updated
- [ ] Application redeployed
- [ ] Test emails sent successfully
- [ ] Email mode shows "Live" instead of "Mock"

### After Production:
- [ ] Create test employee and verify welcome email received
- [ ] Reset test employee password and verify reset email received
- [ ] Check email delivery to spam folder if not in inbox
- [ ] Monitor server logs for any email errors

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**
   - **Solution**: Verify Gmail App Password is correct (16 characters)
   - **Check**: 2-Step Verification is enabled on Gmail account

2. **"Connection refused" error**
   - **Solution**: Verify SMTP settings (smtp.gmail.com:587)
   - **Check**: EMAIL_SERVER_HOST and EMAIL_SERVER_PORT are correct

3. **Emails not sending but no errors**
   - **Solution**: Check EMAIL_ENABLED is set to "true"
   - **Check**: Verify environment variables are deployed

4. **Emails going to spam**
   - **Solution**: This is normal for new sending domains
   - **Action**: Ask recipients to mark as "Not Spam"

### Debug Steps:
1. Check admin settings page for email service status
2. Use test buttons to verify configuration
3. Check Vercel function logs for detailed error messages
4. Verify Gmail account settings and App Password

## Current Configuration

**Email Address**: hailemariameyayu@gmail.com (from Laravel project)
**SMTP Provider**: Gmail (smtp.gmail.com:587)
**Current Mode**: Mock (change EMAIL_ENABLED to "true" for live mode)
**Templates**: Professional HTML with fallback text versions

## Files Modified

- `src/lib/emailService.ts` - Email service implementation
- `src/app/api/employees/route.ts` - Employee registration emails
- `src/app/api/students/route.ts` - Student registration emails
- `src/app/api/employees/[id]/reset-password/route.ts` - Employee password reset emails
- `src/app/api/students/[id]/reset-password/route.ts` - Student password reset emails
- `src/app/admin/settings/page.tsx` - Email testing interface
- `src/app/api/admin/test-email/route.ts` - Email testing API

## Next Steps

1. **Set up Gmail App Password** using the instructions above
2. **Update Vercel environment variables** with the App Password
3. **Redeploy the application** to apply changes
4. **Test email functionality** using the admin settings page
5. **Monitor email delivery** and check spam folders initially