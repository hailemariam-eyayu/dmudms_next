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

// Emergency Contact interface
export interface EmergencyContact {
  student_id: string;
  father_name: string;
  grand_father: string;
  grand_grand_father: string;
  mother_name: string;
  phone: string;
  region: string;
  woreda: string;
  kebele: string;
}

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
    first_name: 'Abebe',
    second_name: 'Kebede',
    last_name: 'Tesfaye',
    email: 'abebe.tesfaye@dmu.edu.et',
    gender: 'male',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU002',
    first_name: 'Hanan',
    second_name: 'Mohammed',
    last_name: 'Ahmed',
    email: 'hanan.ahmed@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU003',
    first_name: 'Dawit',
    second_name: 'Haile',
    last_name: 'Mariam',
    email: 'dawit.mariam@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'visual',
    status: 'active'
  },
  {
    student_id: 'DMU004',
    first_name: 'Meron',
    second_name: 'Tadesse',
    last_name: 'Bekele',
    email: 'meron.bekele@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU005',
    first_name: 'Yohannes',
    second_name: 'Getachew',
    last_name: 'Desta',
    email: 'yohannes.desta@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'physical',
    status: 'active'
  },
  {
    student_id: 'DMU006',
    first_name: 'Rahel',
    second_name: 'Alemayehu',
    last_name: 'Wolde',
    email: 'rahel.wolde@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU007',
    first_name: 'Biniam',
    second_name: 'Tekle',
    last_name: 'Giorgis',
    email: 'biniam.giorgis@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU008',
    first_name: 'Selamawit',
    second_name: 'Mulugeta',
    last_name: 'Assefa',
    email: 'selamawit.assefa@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'hearing',
    status: 'active'
  },
  {
    student_id: 'DMU009',
    first_name: 'Ephrem',
    second_name: 'Berhe',
    last_name: 'Gebremedhin',
    email: 'ephrem.gebremedhin@dmu.edu.et',
    gender: 'male',
    batch: '2023',
    disability_status: 'none',
    status: 'active'
  },
  {
    student_id: 'DMU010',
    first_name: 'Bethlehem',
    second_name: 'Teshome',
    last_name: 'Negash',
    email: 'bethlehem.negash@dmu.edu.et',
    gender: 'female',
    batch: '2024',
    disability_status: 'none',
    status: 'active'
  }
];

// Sample Employees
export const sampleEmployees: Employee[] = [
  {
    employee_id: 'EMP001',
    first_name: 'Dr. Alemayehu',
    last_name: 'Tadesse',
    email: 'alemayehu.tadesse@dmu.edu.et',
    gender: 'male',
    phone: '+251911234567',
    department: 'Administration',
    role: 'admin',
    status: 'active'
  },
  {
    employee_id: 'EMP002',
    first_name: 'Aster',
    last_name: 'Bekele',
    email: 'aster.bekele@dmu.edu.et',
    gender: 'female',
    phone: '+251911234568',
    department: 'Student Affairs',
    role: 'directorate',
    status: 'active'
  },
  {
    employee_id: 'EMP003',
    first_name: 'Mulugeta',
    last_name: 'Haile',
    email: 'mulugeta.haile@dmu.edu.et',
    gender: 'male',
    phone: '+251911234569',
    department: 'Dormitory Management',
    role: 'coordinator',
    status: 'active'
  },
  {
    employee_id: 'EMP004',
    first_name: 'Tigist',
    last_name: 'Wolde',
    email: 'tigist.wolde@dmu.edu.et',
    gender: 'female',
    phone: '+251911234570',
    department: 'Block A Supervision',
    role: 'proctor',
    status: 'active'
  },
  {
    employee_id: 'EMP005',
    first_name: 'Getachew',
    last_name: 'Mekonen',
    email: 'getachew.mekonen@dmu.edu.et',
    gender: 'male',
    phone: '+251911234571',
    department: 'Registration Office',
    role: 'registrar',
    status: 'active'
  },
  {
    employee_id: 'EMP006',
    first_name: 'Hiwot',
    last_name: 'Tesfaye',
    email: 'hiwot.tesfaye@dmu.edu.et',
    gender: 'female',
    phone: '+251911234572',
    department: 'Block B Supervision',
    role: 'proctor',
    status: 'active'
  },
  {
    employee_id: 'EMP007',
    first_name: 'Bereket',
    last_name: 'Assefa',
    email: 'bereket.assefa@dmu.edu.et',
    gender: 'male',
    phone: '+251911234573',
    department: 'Block C Supervision',
    role: 'proctor',
    status: 'active'
  },
  {
    employee_id: 'EMP008',
    first_name: 'Seble',
    last_name: 'Girma',
    email: 'seble.girma@dmu.edu.et',
    gender: 'female',
    phone: '+251911234574',
    department: 'Proctor Management',
    role: 'proctor_manager',
    status: 'active'
  },
  {
    employee_id: 'EMP009',
    first_name: 'Tekle',
    last_name: 'Negash',
    email: 'tekle.negash@dmu.edu.et',
    gender: 'male',
    phone: '+251911234575',
    department: 'Maintenance',
    role: 'maintainer',
    status: 'active'
  },
  {
    employee_id: 'EMP0010',
    first_name: 'Almaz',
    last_name: 'Desta',
    email: 'almaz.desta@dmu.edu.et',
    gender: 'female',
    phone: '+251911234576',
    department: 'Student Coordination',
    role: 'coordinator',
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

// Sample Emergency Contacts
export const sampleEmergencyContacts: EmergencyContact[] = [
  {
    student_id: 'DMU001',
    father_name: 'Kebede',
    grand_father: 'Tesfaye',
    grand_grand_father: 'Wolde',
    mother_name: 'Almaz Haile',
    phone: '+251911111111',
    region: 'Amhara',
    woreda: 'Bahir Dar',
    kebele: '01'
  },
  {
    student_id: 'DMU002',
    father_name: 'Mohammed',
    grand_father: 'Ahmed',
    grand_grand_father: 'Hassan',
    mother_name: 'Fatima Ibrahim',
    phone: '+251911111112',
    region: 'Oromia',
    woreda: 'Adama',
    kebele: '02'
  },
  {
    student_id: 'DMU003',
    father_name: 'Haile',
    grand_father: 'Mariam',
    grand_grand_father: 'Gebre',
    mother_name: 'Tsehay Bekele',
    phone: '+251911111113',
    region: 'Tigray',
    woreda: 'Mekelle',
    kebele: '03'
  },
  {
    student_id: 'DMU004',
    father_name: 'Tadesse',
    grand_father: 'Bekele',
    grand_grand_father: 'Alemu',
    mother_name: 'Birtukan Desta',
    phone: '+251911111114',
    region: 'SNNPR',
    woreda: 'Hawassa',
    kebele: '04'
  },
  {
    student_id: 'DMU005',
    father_name: 'Getachew',
    grand_father: 'Desta',
    grand_grand_father: 'Tekle',
    mother_name: 'Meseret Girma',
    phone: '+251911111115',
    region: 'Addis Ababa',
    woreda: 'Bole',
    kebele: '05'
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
