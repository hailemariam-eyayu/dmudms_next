# 🔧 UPDATE VERCEL ENVIRONMENT VARIABLES

## 📋 STEP-BY-STEP INSTRUCTIONS

### **1. Access Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Find and click on your project: **dmudms-next**

### **2. Navigate to Environment Variables**
1. Click on the **Settings** tab
2. Click on **Environment Variables** in the left sidebar

### **3. Update MONGODB_URI**
1. Find the **MONGODB_URI** variable in the list
2. Click the **Edit** button (pencil icon) next to it
3. Replace the current value with:
   ```
   mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Click **Save**

### **4. Verify Other Environment Variables**
Make sure these are also set correctly:

| Variable | Value |
|----------|-------|
| `NEXTAUTH_SECRET` | `da53d492d0495949bbd5a8ddbb2fd7c6` |
| `NEXTAUTH_URL` | `https://dmudms-next.vercel.app` |
| `DEMO_MODE` | `false` |

### **5. Redeploy Application**
1. Go to the **Deployments** tab
2. Find the latest deployment
3. Click the **3 dots menu** (⋯) next to it
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

### **6. Test the Update**
After redeployment:
1. Clear browser cache for `dmudms-next.vercel.app`
2. Go to: https://dmudms-next.vercel.app/auth/signin
3. Login with: **Employee1** / **password**

## ✅ EXPECTED RESULTS

After updating and redeploying:
- ✅ Login with Employee1/password should work
- ✅ Admin dashboard should show 10 employees
- ✅ Student pages should work without 404 errors
- ✅ No 401 Unauthorized errors in browser console
- ✅ Data updates should persist

## 🔍 VERIFICATION

Use these credentials to test different roles:

| Role | Username | Password | Expected Dashboard |
|------|----------|----------|-------------------|
| Admin | Employee1 | password | `/admin` - Employee management |
| Directorate | Employee3 | password | `/directorate` - Block management |
| Coordinator | Employee2 | password | `/coordinator` - Proctor assignments |
| Student | Student1 | password | `/student` - Room placement |

## ⚠️ TROUBLESHOOTING

If login still fails after update:
1. **Double-check the MongoDB URI** - ensure it's exactly as shown above
2. **Try incognito/private browsing** - to avoid cache issues
3. **Check Vercel deployment logs** - for any error messages
4. **Verify environment variables** - make sure they saved correctly

## 📱 QUICK TEST CHECKLIST

After deployment, verify:
- [ ] https://dmudms-next.vercel.app loads
- [ ] Login page appears at `/auth/signin`
- [ ] Employee1/password login succeeds
- [ ] Admin dashboard shows employee list
- [ ] Student pages work: `/student/placement`, `/student/materials`, `/student/emergency-contact`
- [ ] No console errors (press F12 to check)

## 🎯 SUCCESS INDICATORS

You'll know it's working when:
- ✅ Login redirects to appropriate dashboard based on role
- ✅ Employee list shows Employee1-Employee10
- ✅ Student list shows Student1-Student10
- ✅ All navigation links work
- ✅ Data persists after refresh