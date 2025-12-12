# Email Service Troubleshooting Guide

## 🚨 **Current Issue: Emails Not Sending**

The email service is currently in **MOCK MODE** and not sending real emails. Here's how to fix it:

## 🔧 **Quick Fix Steps**

### **Step 1: Set Up Gmail App Password**

1. **Go to Google Account Settings**: https://myaccount.google.com/
2. **Enable 2-Step Verification**: Security → 2-Step Verification
3. **Create App Password**: Security → App passwords → Mail
4. **Copy the 16-character password**: Example: `abcd efgh ijkl mnop`

### **Step 2: Update Environment Variables**

#### **For Local Development:**
Update `.env.local`:
```env
EMAIL_ENABLED="true"
EMAIL_SERVER_PASSWORD="your_16_character_app_password_here"
```

#### **For Production (Vercel):**
1. Go to: https://vercel.com/dashboard
2. Select: dmudms-next → Settings → Environment Variables
3. Update these variables:
```
EMAIL_ENABLED=true
EMAIL_SERVER_PASSWORD=your_16_character_app_password_here
```

### **Step 3: Test Email Service**

1. **Go to Admin Settings**: http://localhost:3000/admin/settings (local) or https://dmudms-next.vercel.app/admin/settings (production)
2. **Scroll to Notifications section**
3. **Click test buttons**: "Test Welcome Email", "Test Reset Email"
4. **Check results**: Should show "Live" mode instead of "Mock" mode

## 🔍 **Debugging Steps**

### **Check Current Status**
1. **Admin Settings Page**: Shows email service status
2. **Console Logs**: Check browser console for email sending attempts
3. **Server Logs**: Check Vercel function logs for detailed errors

### **Common Issues & Solutions**

#### **Issue 1: "Mock Mode" Still Active**
- **Cause**: `EMAIL_ENABLED` not set to `"true"`
- **Solution**: Update environment variable and redeploy

#### **Issue 2: "Invalid credentials" Error**
- **Cause**: Wrong Gmail App Password
- **Solution**: Generate new App Password and update environment

#### **Issue 3: "Connection refused" Error**
- **Cause**: SMTP settings incorrect
- **Solution**: Verify `smtp.gmail.com:587` settings

#### **Issue 4: Emails Going to Spam**
- **Cause**: New sending domain
- **Solution**: Ask recipients to mark as "Not Spam"

## 📧 **Email Integration Points**

### **Automatic Email Sending Occurs When:**
1. **New Employee Created** (Manual or CSV)
2. **New Student Created** (Manual or CSV)
3. **Password Reset** (Employee or Student)

### **Email Content Includes:**
- **Welcome Emails**: Login credentials, security tips, login link
- **Password Reset**: New password, security warnings, immediate action prompts

## 🧪 **Testing Email Service**

### **Method 1: Admin Settings Page**
1. Go to `/admin/settings`
2. Scroll to "Notifications" section
3. Use test buttons to verify email sending

### **Method 2: Create Test User**
1. Create a new employee/student with your email
2. Check if welcome email is received
3. Reset password and check if reset email is received

### **Method 3: Manual Script**
Run the test script:
```bash
cd dormitory-management-nextjs
node test-email-service.js
```

## 📊 **Current Configuration**

### **Email Settings:**
- **From**: hailemariameyayu@gmail.com
- **SMTP**: Gmail (smtp.gmail.com:587)
- **Status**: Mock Mode (needs Gmail App Password)
- **Templates**: Professional HTML with DMU branding

### **Environment Variables Needed:**
```env
EMAIL_ENABLED="true"
EMAIL_FROM="hailemariameyayu@gmail.com"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="hailemariameyayu@gmail.com"
EMAIL_SERVER_PASSWORD="your_gmail_app_password"
```

## 🚀 **Production Deployment**

### **Vercel Environment Variables:**
1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Project**: dmudms-next
3. **Go to Settings**: Settings → Environment Variables
4. **Add/Update Variables**:
   - `EMAIL_ENABLED` = `true`
   - `EMAIL_SERVER_PASSWORD` = `your_gmail_app_password`
5. **Redeploy**: Trigger new deployment

### **Verification:**
1. **Check Admin Settings**: Should show "Live" mode
2. **Test Email Sending**: Use test buttons
3. **Create Test User**: Verify welcome email received

## 📝 **Next Steps**

1. **Set up Gmail App Password** (most important)
2. **Update environment variables** in both local and production
3. **Test email service** using admin settings page
4. **Create test user** to verify end-to-end functionality
5. **Monitor email delivery** and check spam folders initially

---

**Note**: The email service is fully implemented and ready - it just needs the Gmail App Password to switch from mock mode to live sending!