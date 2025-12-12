# Manual Production Email Test

## 🧪 **Test User Registration with Email**

### **Method 1: Using Admin Interface (Recommended)**

1. **Go to**: https://dmudms-next.vercel.app/admin/employees
2. **Login**: `Employee1` / `password`
3. **Click**: "Add Employee"
4. **Fill the form**:
   ```
   Employee ID: TEST001
   First Name: Test
   Last Name: User
   Email: lovewithme2932@gmail.com
   Gender: Male
   Role: Proctor
   Phone: +251-911-123456
   Department: IT Testing
   Status: Active
   ```
5. **Submit** and check for success message
6. **Check email**: `lovewithme2932@gmail.com` for welcome email

### **Method 2: Using Student Registration**

1. **Go to**: https://dmudms-next.vercel.app/admin/students
2. **Click**: "Add Student"
3. **Fill the form**:
   ```
   Student ID: STU001
   First Name: Test
   Second Name: Middle
   Last Name: Student
   Email: lovewithme2932@gmail.com
   Gender: Male
   Batch: 2024
   Disability Status: None
   Status: Active
   ```
4. **Submit** and check for success message
5. **Check email**: `lovewithme2932@gmail.com` for welcome email

### **Method 3: Using CSV Upload**

1. **Create test CSV file** (`test-employee.csv`):
   ```csv
   employee_id,first_name,last_name,email,gender,role,phone,department
   TEST002,Test,Employee2,lovewithme2932@gmail.com,male,proctor,+251-911-123456,IT Testing
   ```

2. **Go to**: https://dmudms-next.vercel.app/admin/employees
3. **Click**: "Upload CSV"
4. **Upload** the CSV file
5. **Check results** for emails sent count
6. **Check email**: `lovewithme2932@gmail.com` for welcome email

## 🔍 **Email Service Status Check**

### **Check Admin Settings**
1. **Go to**: https://dmudms-next.vercel.app/admin/settings
2. **Login**: `Employee1` / `password`
3. **Scroll to**: "Notifications" section
4. **Look for**: Email Service Status

**Expected Status**: 
- ✅ **"Live"** (not "Mock Mode")
- ✅ Configuration: hailemariameyayu@gmail.com via Gmail SMTP

### **Test Email Service**
In the admin settings, click these buttons:
- **"Test Welcome Email"**
- **"Test Reset Email"**
- **"Test Service"**

**Expected Results**:
- ✅ Success messages
- ✅ Mode shows "Live"
- ✅ Emails sent successfully

## 📧 **Expected Email Content**

The welcome email should contain:
- **Subject**: "Welcome to DMUDMS - Your Account Details"
- **From**: DMUDMS <hailemariameyayu@gmail.com>
- **Content**:
  - Professional HTML template with DMU branding
  - Login credentials (User ID + Password)
  - Direct login link: https://dmudms-next.vercel.app/auth/signin
  - Security recommendations
  - Mobile-responsive design

## 🎯 **Success Indicators**

### **Registration Success**:
- ✅ Success message appears after form submission
- ✅ User appears in the employee/student list
- ✅ Generated password is displayed (for manual entry)
- ✅ "Email sent successfully" message appears

### **Email Service Working**:
- ✅ Admin settings shows "Live" mode
- ✅ Test buttons return success
- ✅ Welcome email received in inbox
- ✅ Email contains correct login credentials

### **CSV Upload Success**:
- ✅ Upload results show "X emails sent"
- ✅ All valid entries processed
- ✅ Welcome emails received for each user

## 🔧 **Troubleshooting**

### **If Email Service Still Shows "Mock Mode"**:
1. Check Vercel environment variables are set
2. Ensure `EMAIL_ENABLED=true` (exactly)
3. Redeploy the application
4. Wait a few minutes for deployment

### **If "Invalid Credentials" Error**:
1. Verify Gmail App Password is correct
2. Check 2-Step Verification is enabled
3. Try generating a new App Password

### **If Emails Not Received**:
1. Check spam/junk folder
2. Verify email address is correct
3. Check Gmail account can receive emails
4. Look at Vercel function logs for errors

## 📊 **Test Results Template**

After testing, record results:

```
Test Date: ___________
Email Address: lovewithme2932@gmail.com

Admin Settings Status:
[ ] Email Service Status: Live / Mock Mode
[ ] Test buttons work: Yes / No

Employee Registration:
[ ] Form submission: Success / Failed
[ ] Email received: Yes / No
[ ] Correct credentials: Yes / No

Student Registration:
[ ] Form submission: Success / Failed
[ ] Email received: Yes / No
[ ] Correct credentials: Yes / No

CSV Upload:
[ ] Upload successful: Yes / No
[ ] Emails sent count: ___
[ ] Emails received: Yes / No
```

---

**Note**: Test with the admin interface first as it's the most reliable method. The email service should work immediately if environment variables are set correctly!