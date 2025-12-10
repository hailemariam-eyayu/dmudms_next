# Deployment Guide for Dormitory Management System

## Quick Deploy to Vercel

### 1. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

```bash
MONGODB_URI=mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_SECRET=your-secure-secret-key-here
NEXTAUTH_URL=https://your-app-name.vercel.app
DEMO_MODE=false
```

### 2. Generate NextAuth Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Deploy Commands
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### 4. MongoDB Atlas Configuration
- Database: `dormitory_management`
- Username: `dmudms`
- Password: `dmudms`
- Connection string is already configured

### 5. Default Login Credentials

**Admin:**
- Username: `EMP001`
- Password: `default123`

**Student:**
- Username: `DMU001`
- Password: `default123`

## Local Development

### 1. Clone and Install
```bash
git clone https://github.com/hailemariam-eyayu/dmudms_next.git
cd dmudms_next
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and update values:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Features
- ✅ Role-based authentication (Admin, Director, Proctor, Student, etc.)
- ✅ Student management and registration
- ✅ Room allocation and placement system
- ✅ Request management (room changes, maintenance, complaints)
- ✅ Emergency reporting system
- ✅ Notification system
- ✅ Dashboard with statistics
- ✅ MongoDB Atlas integration
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety

## Tech Stack
- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** NextAuth.js
- **Database:** MongoDB Atlas with Mongoose
- **Deployment:** Vercel
- **Icons:** Lucide React

## API Routes
- `/api/auth/*` - Authentication
- `/api/students` - Student management
- `/api/employees` - Employee management
- `/api/rooms` - Room management
- `/api/blocks` - Block management
- `/api/placements` - Student placements
- `/api/requests` - Request management
- `/api/dashboard/stats` - Dashboard statistics

## Troubleshooting

### Build Issues
If you encounter build issues, try:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check network access settings in MongoDB Atlas
- Ensure database user has proper permissions

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure all environment variables are properly set