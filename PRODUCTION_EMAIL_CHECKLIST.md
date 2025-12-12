# Production Email Setup Checklist

## ✅ **Step-by-Step Setup**

### **1. Gmail App Password Setup**
- [ ] Go to https://myaccount.google.com/
- [ ] Enable 2-Step Verification (Security → 2-Step Verification)
- [ ] Generate App Password (Security → App passwords → Mail)
- [ ] Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### **2. Vercel Environment Variables**
- [ ] Go to https://vercel.com/dashboard
- [ ] Select `dmudms-next` project
- [ ] Go to Settings → Environment Variables
- [ ] Set these variables:

```
EMAIL_ENABLED = true
EMAIL_FROM = hailemariameyayu@gmail.com
EMAIL_SERVER_HOST = smtp.gmail.com
EMAIL_SERVER_PORT = 587
EMAIL_SERVER_USER = hailemariameyayu@gmail.com
EMAIL_SERVER_PASSWORD = [YOUR_16_CHARACTER_APP_PASSWORD]
```

### **3. Deploy and Verify**
- [ ] Redeploy the application (or wait for auto-deploy)
- [ ] Go to https://dmudms-next.vercel.app/admin/settings
- [ ] Login with `Employee1` / `password`
- [ ] Scroll to "Notifications" section
- [ ] Check email service status (should show "Live" not "Mock Mode")

### **4. Test Email Service**
- [ ] Click "Test Welcome Email" button
- [ ] Click "Test Reset Email" button  
- [ ] Click "Test Service" button
- [ ] Verify results show successful sending

### **5. End-to-End Testing**
- [ ] Create test employee with your email address
- [ ] Check if welcome email is received in your inbox
- [ ] Reset password for test employee
- [ ] Check if reset email is received
- [ ] Upload CSV with test data
- [ ] Verify multiple welcome emails are sent

## 🔍 **Verification Points**

### **Admin Settings Page Should Show:**
- ✅ Email Service Status: **"Live"** (not "Mock Mode")
- ✅ Configuration: hailemariameyayu@gmail.com via Gmail SMTP
- ✅ Test buttons return success messages
- ✅ Mode shows "Live" in test results

### **Email Integration Working:**
- ✅ Manual employee creation → Welcome email sent
- ✅ Manual student creation → Welcome email sent
- ✅ CSV employee upload → Welcome emails sent for all
- ✅ CSV student upload → Welcome emails sent for all
- ✅ Password reset → Reset notification sent

### **Email Content Verification:**
- ✅ Professional HTML template with DMU branding
- ✅ Contains login credentials (User ID + Password)
- ✅ Includes direct login link
- ✅ Security recommendations included
- ✅ Mobile-responsive design

## 🚨 **Troubleshooting**

### **If Still in Mock Mode:**
- Check `EMAIL_ENABLED` is exactly `"true"` (not `true` without quotes)
- Verify environment variables are saved in Vercel
- Redeploy the application

### **If "Invalid Credentials" Error:**
- Verify Gmail App Password is correct (16 characters)
- Ensure 2-Step Verification is enabled on Gmail
- Try generating a new App Password

### **If "Connection Refused" Error:**
- Verify SMTP settings: `smtp.gmail.com:587`
- Check if Gmail account is accessible
- Ensure no firewall blocking SMTP

### **If Emails Go to Spam:**
- This is normal for new sending domains
- Ask recipients to mark as "Not Spam"
- Check email content for spam triggers

## 📊 **Current Status**

**Email Service:** ✅ Fully implemented and ready
**Templates:** ✅ Professional HTML with DMU branding  
**Integration:** ✅ All registration and reset flows
**Configuration:** ⚠️ Needs Gmail App Password setup

## 🎯 **Expected Results**

Once properly configured:
- All new user registrations will automatically send welcome emails
- Password resets will send professional notification emails
- CSV uploads will send welcome emails to all valid entries
- Admin can test email service anytime via settings page
- Email service will show "Live" status instead of "Mock"

---

**Note:** The email service is production-ready and just needs the Gmail App Password to go live!