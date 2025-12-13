# Student Update Issue Fix

## Issues Fixed

### 1. Authorization Issue
**Problem**: Directorate users were getting "Unauthorized" error when trying to update student details.

**Root Cause**: The student update API (`/api/students/[id]/route.ts`) only allowed `admin` role for PUT and DELETE operations.

**Solution**: Updated permissions to include both `admin` and `directorate` roles:
```typescript
// Before
if (!session || session.user.role !== 'admin') {

// After  
if (!session || !['admin', 'directorate'].includes(session.user.role)) {
```

### 2. Student Not Found Issue
**Problem**: Users were getting "Student not found" error when trying to update student details.

**Root Cause**: The frontend sends MongoDB ObjectId (`editingStudent._id`) but the API was trying `student_id` lookup first, which would fail for ObjectIds.

**Solution**: Enhanced ID detection logic to determine if the ID is a MongoDB ObjectId (24 hex characters) and try the appropriate method first:

```typescript
// Smart ID detection
const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

if (isMongoId) {
  // Try MongoDB _id methods first
  result = await mongoDataStore.updateStudentById(id, safeUpdateData);
} else {
  // Try student_id methods first  
  result = await mongoDataStore.updateStudent(id, safeUpdateData);
}
```

### 3. Enhanced Debugging
**Added**: Comprehensive logging to track:
- Request details (ID, update data, user role)
- Which update method is being attempted
- Success/failure of each method
- Error details if both methods fail

## Changes Made

### Files Updated:
- `src/app/api/students/[id]/route.ts`
  - Updated PUT method permissions (admin + directorate)
  - Updated DELETE method permissions (admin + directorate)  
  - Enhanced ID detection logic for GET, PUT, DELETE
  - Added comprehensive debugging logs

### API Methods Fixed:
- **GET** `/api/students/[id]` - Smart ID detection
- **PUT** `/api/students/[id]` - Permission fix + Smart ID detection + debugging
- **DELETE** `/api/students/[id]` - Permission fix + Smart ID detection

## Testing

After deployment, both issues should be resolved:

1. **Directorate Access**: Directorate users can now update and delete student records
2. **Student Updates**: Updates using MongoDB ObjectId (from frontend) will work correctly
3. **Debugging**: Detailed logs will help identify any remaining issues

## Frontend Behavior

The admin students page uses `editingStudent._id` for updates, which is a MongoDB ObjectId. The enhanced API now:

1. Detects this is a MongoDB ObjectId
2. Tries `updateStudentById()` first (correct method)
3. Falls back to `updateStudent()` if needed
4. Provides detailed logging for troubleshooting

This ensures compatibility with both ID formats while optimizing for the most common case (MongoDB ObjectId from frontend).