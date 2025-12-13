# Exit Paper System Implementation

## Overview
Implemented a comprehensive exit paper system where students can fill out forms to take items out of the dormitory, proctors approve them, and security guards can view approved papers.

## Changes Made

### 1. Role Updates
- **Removed**: `proctor_manager` role
- **Added**: `security_guard` role

#### Files Updated:
- `src/models/mongoose/Employee.ts` - Updated role enum
- `src/lib/auth.ts` - Updated UserRole type and role hierarchy
- `src/app/admin/employees/page.tsx` - Updated role dropdown
- `src/app/api/employees/upload-csv/route.ts` - Updated valid roles
- `src/middleware.ts` - Added security_guard route permissions

### 2. Exit Paper Model
Created `src/models/mongoose/ExitPaper.ts` with:
- Student information (ID, name)
- Items array (type_of_cloth, number_of_items, color)
- Status (pending, approved, rejected)
- Approval information (approved_by, approved_by_name, approved_at)
- Rejection reason
- Timestamps

### 3. API Routes

#### `/api/exit-papers` (GET, POST)
- **GET**: Returns exit papers based on user role
  - Students: Only their own papers
  - Proctors/Coordinators/Admin/Directorate: All papers
  - Security Guards: Only approved papers
- **POST**: Students can create new exit papers

#### `/api/exit-papers/[id]` (GET, PUT, DELETE)
- **GET**: View specific exit paper (with role-based permissions)
- **PUT**: Approve/reject exit papers (proctors and above only)
- **DELETE**: Delete exit papers (students can delete pending, admin can delete any)

### 4. User Interfaces

#### Student Exit Paper Page (`/student/exit-paper`)
- Create new exit papers with multiple items
- Dynamic form to add/remove items
- View submission history with status
- Detailed view of each paper including rejection reasons

#### Proctor Exit Papers Page (`/proctor/exit-papers`)
- View all exit papers with filtering by status
- Statistics dashboard (total, pending, approved, rejected)
- Approve/reject functionality with rejection reasons
- Detailed view of each paper

#### Security Guard Dashboard (`/security-guard`)
- View only approved exit papers
- Search and filter functionality
- Statistics (total approved, today's approvals, total items)
- Detailed view with clear approval information

### 5. Navigation Updates
Updated `src/components/RoleBasedNavigation.tsx`:
- Added "Exit Papers" link for proctors
- Added "Exit Paper" link for students
- Added security guard navigation with dashboard and exit papers
- Removed proctor_manager references

### 6. Permissions & Security
- **Students**: Can create and view their own exit papers
- **Proctors**: Can view all papers and approve/reject pending ones
- **Coordinators/Admin/Directorate**: Full access to all papers
- **Security Guards**: Can only view approved papers
- **Middleware**: Added security-guard route protection

## Features

### Exit Paper Form
- **Type of Cloth**: Text field for item description
- **Number of Items**: Numeric field (minimum 1)
- **Color**: Text field for item color
- **Dynamic Rows**: Add/remove multiple items
- **Validation**: Ensures all fields are filled

### Approval Workflow
1. **Student Submission**: Student fills out form with items
2. **Proctor Review**: Proctor can approve or reject with reason
3. **Security Verification**: Security guard can view approved papers

### Status Tracking
- **Pending**: Newly submitted, awaiting approval
- **Approved**: Approved by proctor, visible to security
- **Rejected**: Rejected by proctor with reason

### Search & Filter
- **Student Search**: By name, ID, or item details
- **Date Filter**: Filter by approval/submission date
- **Status Filter**: Filter by pending/approved/rejected

## Database Schema

```typescript
interface ExitPaper {
  student_id: string;
  student_name: string;
  items: Array<{
    type_of_cloth: string;
    number_of_items: number;
    color: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}
```

## Usage Flow

1. **Student**: Creates exit paper → Status: Pending
2. **Proctor**: Reviews and approves/rejects → Status: Approved/Rejected
3. **Security Guard**: Views approved papers for verification

This system provides a complete audit trail for items leaving the dormitory while maintaining proper authorization and security controls.