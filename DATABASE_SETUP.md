# 🗄️ Database Setup Guide

## 📋 Overview

Your dormitory management system supports multiple database options. Choose the one that best fits your needs:

## 🎯 **Quick Start (No Database Required)**

The app works immediately with **in-memory data store** - perfect for:
- ✅ **Demo and testing**
- ✅ **Development**
- ✅ **Proof of concept**

```bash
npm run dev
# App runs at http://localhost:3000 with sample data
```

## 🚀 **Production Database Options**

### Option 1: PlanetScale (MySQL) - **RECOMMENDED**

**Best for Laravel migration** - MySQL-compatible with serverless scaling

#### Setup Steps:

1. **Create PlanetScale Account**
   - Go to [planetscale.com](https://planetscale.com)
   - Create free account
   - Create new database: `dormitory-management`

2. **Get Connection String**
   ```bash
   # In PlanetScale dashboard, get connection string
   DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/dormitory-management?sslaccept=strict"
   ```

3. **Setup Prisma**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Optional: Seed with sample data
   npx prisma db seed
   ```

4. **Update Environment**
   ```bash
   # Add to .env.local
   DATABASE_URL="your-planetscale-connection-string"
   ```

### Option 2: MongoDB Atlas - **FLEXIBLE**

**Best for document-based data** - NoSQL with flexible schemas

#### Setup Steps:

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free cluster
   - Create database: `dormitory_management`

2. **Get Connection String**
   ```bash
   MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/dormitory_management?retryWrites=true&w=majority"
   ```

3. **Update Environment**
   ```bash
   # Add to .env.local
   MONGODB_URI="your-mongodb-connection-string"
   ```

### Option 3: Supabase (PostgreSQL) - **REAL-TIME**

**Best for real-time features** - PostgreSQL with built-in auth and real-time

#### Setup Steps:

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get database URL from settings

2. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Setup Database**
   ```bash
   DATABASE_URL="postgresql://username:password@db.supabase.co:5432/postgres"
   npx prisma db push
   ```

### Option 4: Railway - **FULL-STACK**

**Best for complete hosting** - Database + app hosting in one place

#### Setup Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Create MySQL or PostgreSQL database
   - Deploy your Next.js app

2. **Get Connection Details**
   ```bash
   DATABASE_URL="mysql://username:password@containers-us-west-1.railway.app:port/database"
   ```

## 🔧 **Database Migration from Laravel**

If you have existing Laravel data:

### Export from Laravel MySQL:
```bash
# Export data from Laravel
mysqldump -u username -p laravel_db > dormitory_data.sql

# Import structure (modify for Prisma schema)
# Use the exported data to populate your new database
```

### Data Migration Script:
```typescript
// src/scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateData() {
  // Import your Laravel data here
  // Convert and insert into new schema
}
```

## 🔐 **Authentication Setup**

The app includes **role-based authentication** with these roles:

- **Admin** - Full system access
- **Directorate** - Management oversight
- **Coordinator** - Placement coordination
- **Proctor** - Block supervision
- **Registrar** - Student registration
- **Maintainer** - Maintenance requests
- **Student** - Personal dashboard

### Default Credentials:
```
Admin:      EMP001 / default123
Directorate: EMP002 / default123
Proctor:    EMP004 / default123
Student:    DMU001 / default123
```

## 📊 **Database Schema Overview**

### Core Tables:
- **students** - Student information and credentials
- **employees** - Staff information and roles
- **blocks** - Dormitory blocks configuration
- **rooms** - Individual rooms with capacity
- **student_placements** - Room assignments
- **proctor_placements** - Staff assignments
- **requests** - Student requests and maintenance
- **emergencies** - Emergency incidents
- **notifications** - System announcements

### Relationships:
- Students → Placements (1:1)
- Rooms → Placements (1:many)
- Blocks → Rooms (1:many)
- Students → Requests (1:many)

## 🚀 **Deployment with Database**

### Vercel + PlanetScale:
```bash
# 1. Setup PlanetScale database
# 2. Add DATABASE_URL to Vercel environment variables
# 3. Deploy to Vercel
vercel --prod
```

### Vercel + MongoDB Atlas:
```bash
# 1. Setup MongoDB Atlas
# 2. Add MONGODB_URI to Vercel environment variables
# 3. Deploy to Vercel
vercel --prod
```

## 🔄 **Switching Between Databases**

The app is designed to easily switch between database types:

### Current: In-Memory Store
```typescript
// src/lib/dataStore.ts
// Uses JavaScript objects and arrays
```

### Switch to Prisma (MySQL/PostgreSQL):
```typescript
// Replace dataStore calls with Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Example:
// dataStore.getStudents() → prisma.student.findMany()
```

### Switch to Mongoose (MongoDB):
```typescript
// Replace dataStore calls with Mongoose
import Student from '@/models/mongoose/Student';

// Example:
// dataStore.getStudents() → Student.find()
```

## 📈 **Performance Considerations**

### PlanetScale Benefits:
- ✅ Serverless scaling
- ✅ Global read replicas
- ✅ Branching for schema changes
- ✅ MySQL compatibility

### MongoDB Benefits:
- ✅ Flexible document structure
- ✅ Horizontal scaling
- ✅ Rich query capabilities
- ✅ Built-in aggregation

### Supabase Benefits:
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Auto-generated APIs
- ✅ PostgreSQL features

## 🛠️ **Development Workflow**

1. **Start with in-memory store** (current setup)
2. **Choose your database** based on requirements
3. **Update environment variables**
4. **Run migrations** to create schema
5. **Update API routes** to use database instead of dataStore
6. **Test thoroughly** before deployment
7. **Deploy to production** with database

## 🎯 **Recommendation**

For **production deployment**:

1. **Start**: Use current in-memory setup for demo
2. **Migrate**: Choose PlanetScale for MySQL compatibility with Laravel
3. **Scale**: Add real-time features with Supabase if needed
4. **Enterprise**: Consider dedicated database hosting for large scale

The system is designed to grow with your needs! 🚀