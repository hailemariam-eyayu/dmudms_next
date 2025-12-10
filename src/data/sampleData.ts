import { 
  Student, 
  Room, 
  Block, 
  Employee, 
  StudentPlacement, 
  ProctorPlacement,
  Request,
  Emergency,
  Notification 
} from '@/types';

// Sample Blocks
export const sampleBlocks: Block[] = [
  {
    block_id: 'A',
    disable_group: false,
    status: 'active',
    capacity: 200,
    reserved_for: 'male'
  },
  {
    block_id: 'B',
    disable_group: false,
    status: 'active',
    capacity: 180,
    reserved_for: 'female'
  },
  {
    block_id: 'C',
    disable_group: true,
    status: 'active',
    capacity: 50,
    reserved_for: 'disabled'
  },
  {
    block_id: 'D',
    disable_group: false,
    status: 'maintenance',
    capacity: 150,
    reserved_for: 'male'
  }
];

// Sample Rooms
export const sampleRooms: Room[] = [
  // Block A rooms
  { room_id: '101', block: 'A', status: 'occupied', capacity: 4, current_occupancy: 4 },
  { room_id: '102', block: 'A', status: 'occupied', capacity: 4, current_occupancy: 3 },
  { room_id: '103', block: 'A', status: 'available', capacity: 4, current_occupancy: 0 },
  { room_id: '104', block: 'A', status: 'maintenance', capacity: 4, current_occupancy: 0 },
  { room_id: '201', block: 'A', status: 'occupied', capacity: 2, current_occupancy: 2 },
  { room_id: '202', block: 'A', status: 'available', capacity: 2, current_occupancy: 0 },
  
  // Block B rooms
  { room_id: '101', block: 'B', status: 'occupied', capacity: 4, current_occupancy: 4 },
  { room_id: '102', block: 'B', status: 'occupied', capacity: 4, current_occupancy: 2 },
  { room_id: '103', block: 'B', status: 'available', capacity: 4, current_occupancy: 0 },
  { room_id: '201', block: 'B', status: 'occupied', capacity: 2, current_occupancy: 1 },
  
  // Block C rooms (disability accessible)
  { room_id: '101', block: 'C', status: 'occupied', capacity: 2, current_occupancy: 1 },
  { room_id: '102', block: 'C', status: 'available', capacity: 2, current_occupancy: 0 },
  { room_id: '103', block: 'C', status: 'available', capacity: 2, current_occupancy: 0 }
];

// Sample Students
export const sampleStudents: Student[] = [
  {
    student_id: 'DMU001',
    first_name: 'John',
    second_name: 'Michael',
    last_name: 'Smith',
    email: 'john.smith@dmu.edu',
    gender: 'male',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU002',
    first_name: 'Sarah',
    second_name: 'Jane',
    last_name: 'Johnson',
    email: 'sarah.johnson@dmu.edu',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU003',
    first_name: 'Ahmed',
    second_name: 'Hassan',
    last_name: 'Ali',
    email: 'ahmed.ali@dmu.edu',
    gender: 'male',
    batch: '2023',
    disability_status: 'visual',
    status: 'active'
  },
  {
    student_id: 'DMU004',
    first_name: 'Maria',
    second_name: 'Elena',
    last_name: 'Rodriguez',
    email: 'maria.rodriguez@dmu.edu',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU005',
    first_name: 'David',
    second_name: 'James',
    last_name: 'Wilson',
    email: 'david.wilson@dmu.edu',
    gender: 'male',
    batch: '2023',
    disability_status: 'physical',
    status: 'active'
  }
];

// Sample Employees
export const sampleEmployees: Employee[] = [
  {
    employee_id: 'EMP001',
    first_name: 'Dr. Robert',
    last_name: 'Anderson',
    email: 'robert.anderson@dmu.edu',
    role: 'admin',
    status: 'active'
  },
  {
    employee_id: 'EMP002',
    first_name: 'Lisa',
    last_name: 'Thompson',
    email: 'lisa.thompson@dmu.edu',
    role: 'directorate',
    status: 'active'
  },
  {
    employee_id: 'EMP003',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@dmu.edu',
    role: 'coordinator',
    status: 'active'
  },
  {
    employee_id: 'EMP004',
    first_name: 'Jennifer',
    last_name: 'Davis',
    email: 'jennifer.davis@dmu.edu',
    role: 'proctor',
    status: 'active'
  },
  {
    employee_id: 'EMP005',
    first_name: 'James',
    last_name: 'Miller',
    email: 'james.miller@dmu.edu',
    role: 'registrar',
    status: 'active'
  }
];

// Sample Student Placements
export const sampleStudentPlacements: StudentPlacement[] = [
  {
    id: 1,
    student_id: 'DMU001',
    room: '101',
    block: 'A',
    year: '2024',
    status: 'active',
    assigned_date: '2024-09-01'
  },
  {
    id: 2,
    student_id: 'DMU002',
    room: '101',
    block: 'B',
    year: '2024',
    status: 'active',
    assigned_date: '2024-09-01'
  },
  {
    id: 3,
    student_id: 'DMU003',
    room: '101',
    block: 'C',
    year: '2024',
    status: 'active',
    assigned_date: '2024-09-01'
  },
  {
    id: 4,
    student_id: 'DMU004',
    room: '102',
    block: 'B',
    year: '2024',
    status: 'active',
    assigned_date: '2024-09-02'
  }
];

// Sample Proctor Placements
export const sampleProctorPlacements: ProctorPlacement[] = [
  {
    id: 1,
    proctor_id: 'EMP004',
    block: 'A',
    year: '2024',
    first_entry: '2024-09-01',
    status: 'active'
  },
  {
    id: 2,
    proctor_id: 'EMP004',
    block: 'B',
    year: '2024',
    first_entry: '2024-09-01',
    status: 'active'
  }
];

// Sample Requests
export const sampleRequests: Request[] = [
  {
    id: 1,
    student_id: 'DMU001',
    type: 'room_change',
    description: 'Request to change room due to noise issues',
    status: 'pending',
    created_date: '2024-12-08'
  },
  {
    id: 2,
    student_id: 'DMU002',
    type: 'maintenance',
    description: 'Broken window in room 101, Block B',
    status: 'approved',
    created_date: '2024-12-07',
    resolved_by: 'EMP004'
  },
  {
    id: 3,
    student_id: 'DMU004',
    type: 'complaint',
    description: 'Roommate conflict resolution needed',
    status: 'approved',
    created_date: '2024-12-06'
  }
];

// Sample Emergencies
export const sampleEmergencies: Emergency[] = [
  {
    id: 1,
    student_id: 'DMU003',
    type: 'medical',
    description: 'Student fell and injured ankle',
    status: 'resolved',
    reported_date: '2024-12-05',
    resolved_date: '2024-12-05'
  },
  {
    id: 2,
    student_id: 'DMU001',
    type: 'security',
    description: 'Suspicious person seen near Block A',
    status: 'in_progress',
    reported_date: '2024-12-09'
  }
];

// Sample Notifications
export const sampleNotifications: Notification[] = [
  {
    id: 1,
    title: 'Maintenance Schedule',
    message: 'Block D will undergo maintenance from Dec 15-20. Students will be temporarily relocated.',
    type: 'warning',
    target_audience: 'all',
    created_date: '2024-12-01',
    expires_date: '2024-12-20',
    is_active: true
  },
  {
    id: 2,
    title: 'New Semester Registration',
    message: 'Room registration for Spring 2025 semester opens on January 5th.',
    type: 'info',
    target_audience: 'students',
    created_date: '2024-12-08',
    expires_date: '2025-01-05',
    is_active: true
  },
  {
    id: 3,
    title: 'Fire Drill Success',
    message: 'Thank you for your cooperation during yesterday\'s fire drill. All blocks evacuated successfully.',
    type: 'success',
    target_audience: 'all',
    created_date: '2024-12-09',
    is_active: true
  }
];