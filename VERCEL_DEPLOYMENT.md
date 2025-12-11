# Vercel Deployment Instructions

## Required Environment Variables

Set these in your Vercel dashboard (Settings > Environment Variables):

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0
```

### 2. NextAuth Configuration
```
NEXTAUTH_SECRET=your-super-secure-secret-key-here-32-chars-min
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 3. Database Mode
```
DEMO_MODE=false
```

## Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

## Deployment Steps

1. **Push to GitHub** (already done)
2. **Connect to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Set environment variables above

3. **Deploy**
   - Vercel will automatically deploy
   - Check build logs for any errors

## Default Login Credentials

After deployment, use these credentials:

- **Admin:** `EMP001` / `default123`
- **Directorate:** `EMP002` / `default123`
- **Student:** `DMU001` / `default123`

## Troubleshooting

### 401 Authentication Error
- Check NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Verify MongoDB connection string

### 500 Server Error
- Check Vercel function logs
- Verify all environment variables are set
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)

### Database Connection Issues
- Verify MongoDB Atlas credentials
- Check network access settings
- Ensure database user has read/write permissions

## MongoDB Atlas Setup

1. **Network Access**
   - Go to MongoDB Atlas dashboard
   - Network Access > Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere)

2. **Database User**
   - Database Access > Add New Database User
   - Username: `dmudms`
   - Password: `dmudms`
   - Role: `Atlas admin` or `Read and write to any database`

## Post-Deployment Verification

1. Visit your deployed URL
2. Go to `/auth/signin`
3. Login with `EMP001` / `default123`
4. Check dashboard loads
5. Test creating a student
6. Verify all pages work