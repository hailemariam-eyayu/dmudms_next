# 🏠 Dormitory Management System - Next.js

<div align="center">
  <p>
    <em>A comprehensive digital solution for modern dormitory administration</em>
  </p>
  
  <div>
    <img src="https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </div>
</div>

---

## ✨ Overview

The **Dormitory Management System** is a full-stack web application designed to streamline dormitory operations with modern technology. From student placement to proctor management, this system handles all aspects of dormitory administration with efficiency and transparency.

🔹 **For Administrators**: Complete oversight with advanced analytics and bulk operations  
🔹 **For Directorate**: Strategic management of blocks, proctors, and assignments  
🔹 **For Coordinators**: Efficient proctor and block coordination  
🔹 **For Proctors**: Streamlined student management and incident reporting  
🔹 **For Students**: Self-service portal for requests and emergency contacts  

Built with **Next.js 15**, **TypeScript**, **MongoDB**, and deployed on **Vercel** for optimal performance and scalability.

---

## 🌟 Key Features

### 🏢 **Advanced Block Management**
- **Editable Gender Assignment**: Change block reservations from male to female and vice versa
- **Disability Accessibility**: Automatic ground floor room marking for accessibility
- **Real-time Statistics**: Occupancy rates, capacity tracking, and visual progress indicators
- **Proctor Assignment**: Gender-based proctor matching with visual indicators

### 🛏️ **Intelligent Room Assignment**
- **Smart Auto-Assignment**: Prioritizes accessible rooms for students with disabilities
- **Manual Room Selection**: Staff can manually assign specific block+room combinations
- **Flexible Accessibility Logic**: Upper floors in disability blocks available for normal students
- **Visual Status Indicators**: Real-time room availability with color-coded status

### 👥 **Enhanced Student Management**
- **Comprehensive Profiles**: Gender, disability status, emergency contacts, and batch information
- **CSV Import/Export**: Bulk student data management with Ethiopian sample data
- **Password Management**: Automatic password generation with email notifications
- **Emergency Contact System**: Parent/guardian information management

### 🎯 **Advanced Assignment Interface**
- **Gender & Disability Display**: Color-coded badges showing student requirements
- **Assignment Rules Validation**: Prevents invalid assignments with helpful error messages
- **Dual Assignment Options**: Both automatic and manual assignment workflows
- **Room Compatibility Filtering**: Shows only suitable rooms based on student needs

### 👮 **Comprehensive Proctor System**
- **Gender-Based Assignment**: Male proctors for male blocks, female proctors for female blocks
- **Multi-Block Management**: Proctors can manage multiple blocks
- **Student Oversight**: View assigned students with detailed information
- **Request & Emergency Handling**: Streamlined incident management

### 📊 **Role-Based Dashboards**
- **Admin**: System-wide oversight, user management, and configuration
- **Directorate**: Strategic block management and proctor assignments
- **Coordinator**: Proctor coordination and assignment management
- **ProctorManager**: Specialized proctor oversight role
- **Proctor**: Student management and daily operations
- **Student**: Self-service portal for requests and information

### 🔐 **Security & Authentication**
- **NextAuth.js Integration**: Secure session management
- **Role-Based Access Control**: Granular permissions for each user type
- **Password Reset System**: Secure password management with email notifications
- **Session Debugging**: Development tools for authentication troubleshooting

### 📱 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility Compliant**: WCAG guidelines compliance
- **Real-time Updates**: Live data synchronization across the system
- **Intuitive Navigation**: Role-based navigation with clear visual hierarchy

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript 5.0+ with strict type checking
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom React components with Lucide icons
- **State Management**: React hooks with server-side state synchronization

### **Backend**
- **API Routes**: Next.js API routes with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with credential provider
- **Email Service**: Nodemailer with HTML templates
- **Data Validation**: Comprehensive input validation and sanitization

### **Database Schema**
- **Students**: Comprehensive profiles with disability status and emergency contacts
- **Employees**: Role-based staff management with gender-based assignments
- **Blocks**: Gender-specific dormitory blocks with accessibility features
- **Rooms**: Detailed room information with occupancy tracking
- **Placements**: Student-room assignments with historical tracking
- **Requests**: Student request management system
- **Emergency Contacts**: Parent/guardian information system

### **Deployment & DevOps**
- **Platform**: Vercel with automatic deployments
- **Environment**: Production-ready with environment variable management
- **Performance**: Optimized builds with static generation where possible
- **Monitoring**: Built-in error handling and logging

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)

### Installation Guide

```bash
# Clone the repository
git clone https://github.com/hailemariam-eyayu/dmudms_next.git
cd dormitory-management-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-key
# MONGODB_URI=your-mongodb-connection-string

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 🔧 Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database
MONGODB_URI=mongodb://localhost:27017/dormitory-management

# Email (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 🎯 First-Time Setup

1. **Access the System**: Navigate to `http://localhost:3000`
2. **Sample Data**: The system includes comprehensive sample data with Ethiopian names
3. **Default Credentials**: All users have password `default123`
4. **Admin Access**: Use admin credentials to configure the system
5. **Data Import**: Use CSV import functionality for bulk student/employee data

### 👥 Default User Roles & Access

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | ADM001 | default123 | Full system access |
| Directorate | DIR001 | default123 | Block & proctor management |
| Coordinator | COORD001 | default123 | Proctor coordination |
| Proctor | EMP0001 | default123 | Student management |
| Student | STU001 | default123 | Self-service portal |

---

## 📁 Project Structure

```
dormitory-management-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard & management
│   │   ├── directorate/       # Directorate management pages
│   │   ├── coordinator/       # Coordinator workflow pages
│   │   ├── proctor/           # Proctor management interface
│   │   ├── student/           # Student self-service portal
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── students/      # Student management APIs
│   │   │   ├── employees/     # Employee management APIs
│   │   │   ├── blocks/        # Block management APIs
│   │   │   ├── rooms/         # Room management APIs
│   │   │   ├── placements/    # Assignment management APIs
│   │   │   └── export/        # Data export endpoints
│   │   └── auth/              # Authentication pages
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   └── forms/             # Form components
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # Authentication configuration
│   │   ├── mongoDataStore.ts  # MongoDB data layer
│   │   ├── unifiedDataStore.ts # Unified data interface
│   │   └── emailService.ts    # Email notification service
│   ├── models/                # Database models
│   │   └── mongoose/          # Mongoose schemas
│   ├── types/                 # TypeScript definitions
│   ├── data/                  # Sample data & seeders
│   └── styles/                # Global styles
├── public/                    # Static assets
├── prisma/                    # Database schema (if using Prisma)
└── docs/                      # Documentation files
```

---

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

This project is optimized for Vercel deployment:

1. **Push to GitHub**: Commit your code to a GitHub repository
2. **Connect to Vercel**: Import your repository in Vercel dashboard
3. **Environment Variables**: Add your environment variables in Vercel settings
4. **Deploy**: Automatic deployment with zero configuration

**Live Demo**: [https://dmudms-next.vercel.app](https://dmudms-next.vercel.app)

### **Environment Variables for Production**

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
MONGODB_URI=your-production-mongodb-uri
```

### **Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/signin` - User authentication
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - User logout

### **Student Management**
- `GET /api/students` - List all students
- `POST /api/students` - Create new student
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student
- `POST /api/students/upload-csv` - Bulk import students

### **Room Assignment**
- `GET /api/placements` - List all placements
- `POST /api/placements` - Create placement (auto/manual)
- `DELETE /api/placements` - Unassign all students

### **Block Management**
- `GET /api/blocks` - List all blocks
- `POST /api/blocks` - Create new block
- `PUT /api/blocks/[id]` - Update block (including gender assignment)
- `DELETE /api/blocks/[id]` - Delete block

## 🔧 Advanced Features

### **CSV Import/Export**
- **Student Data**: Bulk import with validation and error reporting
- **Employee Data**: Staff management with role assignments
- **Export Functionality**: Generate reports in CSV format

### **Email Notifications**
- **User Registration**: Automatic password emails for new users
- **Password Reset**: Secure password reset with email verification
- **System Notifications**: Important updates and announcements

### **Assignment Logic**
- **Gender-Based**: Strict gender matching for block assignments
- **Accessibility**: Automatic accessible room assignment for students with disabilities
- **Flexible Usage**: Upper floors in disability blocks available for normal students
- **Capacity Management**: Automatic room status updates based on occupancy

### **Data Validation**
- **Input Sanitization**: Comprehensive validation for all user inputs
- **Business Rules**: Enforcement of dormitory assignment rules
- **Error Handling**: Graceful error handling with user-friendly messages

## 🤝 Contributing

We welcome contributions to improve the Dormitory Management System:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for seamless deployment platform
- **MongoDB** for reliable database solutions
- **Tailwind CSS** for beautiful styling system

---

## 🌟 Where Technology Meets Community Living

This system represents our commitment to creating better living spaces through technology, ensuring every student has a safe, comfortable, and well-managed dormitory experience.