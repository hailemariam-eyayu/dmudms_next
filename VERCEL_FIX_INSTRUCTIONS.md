# 🔧 VERCEL DATABASE FIX INSTRUCTIONS

## 🎯 Problem Identified
Vercel is likely using the **WRONG DATABASE** which is empty.

### ✅ Correct Database (HAS DATA)
- **Cluster**: `cluster0.rp9qif7`
- **Employees**: 10 users (Employee1-Employee10)
- **Students**: 10 users (Student1-Student10)
- **Status**: 🟢 Working with correct data

### ❌ Wrong Database (EMPTY)
- **Cluster**: `cluster0.hxcedpm` 
- **Employees**: 0 users
- **Students**: 0 users
- **Status**: 🔴 Empty - causes login failures

## 🔧 STEP-BY-STEP FIX

### 1. Access Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Find and click on your project: **dmudms-next**

### 2. Update Environment Variables
1. Click on **Settings** tab
2. Click on **Environment Variables** in the sidebar
3. Find the **MONGODB_URI** variable
4. Click **Edit** on the MONGODB_URI variable
5. Replace the value with:
   ```
   mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Click **Save**

### 3. Redeploy Application
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **3 dots menu** (⋯) next to it
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

### 4. Test Login
1. Clear your browser cache and cookies for `dmudms-next.vercel.app`
2. Go to: https://dmudms-next.vercel.app/auth/signin
3. Login with:
   - **Username**: Employee1
   - **Password**: password

## 🎯 Verified Login Credentials

| Role | Username | Password | Name | Access |
|------|----------|----------|------|---------|
| Admin | Employee1 | password | Dr. Alemayehu Tadesse | Full system access |
| Directorate | Employee3 | password | Aster Bekele | Block management |
| Coordinator | Employee2 | password | Almaz Desta | Proctor assignments |
| Student | Student1 | password | Abebe Tesfaye | Student portal |

## 🔍 How to Verify Fix Worked

After redeployment, the following should work:
- ✅ Login with Employee1/password succeeds
- ✅ Admin dashboard shows employee list
- ✅ Student pages work: `/student/placement`, `/student/materials`, `/student/emergency-contact`
- ✅ No more 401 Unauthorized errors
- ✅ Data updates persist in the database

## ⚠️ If Still Not Working

1. **Check Environment Variables Again**
   - Ensure MONGODB_URI points to `cluster0.rp9qif7`
   - Verify NEXTAUTH_URL is `https://dmudms-next.vercel.app`
   - Check DEMO_MODE is set to `false`

2. **Try Different Browser/Incognito Mode**
   - Clear all browser data
   - Try incognito/private browsing
   - Test on different device

3. **Check Vercel Deployment Logs**
   - Go to Deployments tab
   - Click on latest deployment
   - Check Function Logs for errors

## 📁 Files Created

- ✅ `.env_production` - Contains correct production environment variables
- ✅ `check-vercel-database.js` - Script to verify database connections
- ✅ `VERCEL_FIX_INSTRUCTIONS.md` - This instruction file

## 🎯 Root Cause

The issue was **database confusion**:
- Your local scripts were updating the correct database (`cluster0.rp9qif7`)
- But Vercel was configured to use the empty database (`cluster0.hxcedpm`)
- This caused login failures because Employee1 exists in the correct database but not in the empty one

**Solution**: Update Vercel to use the correct database URI.