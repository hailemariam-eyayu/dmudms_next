// Core entity types based on the Laravel models

export interface Student {
  student_id: string;
  first_name: string;
  second_name: string;
  last_name: string;
  email: string;
  gender: 'male' | 'female';
  batch: string;
  disability_status: 'none' | 'physical' | 'visual' | 'hearing' | 'other';
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  password?: string;
}

export interface Room {
  room_id: string;
  block: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  capacity: number;
  current_occupancy?: number;
  disability_accessible?: boolean;
  floor?: number;
  room_number?: string;
}

export interface Block {
  block_id: string;
  disable_group: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  reserved_for: 'male' | 'female' | 'mixed' | 'disabled';
}

export interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: 'male' | 'female';
  phone?: string;
  department?: string;
  role: 'admin' | 'directorate' | 'coordinator' | 'proctor' | 'proctor_manager' | 'registrar' | 'maintainer';
  status: 'active' | 'inactive';
  password?: string;
}

export interface StudentPlacement {
  id: number;
  student_id: string;
  room: string;
  block: string;
  year: string;
  status: 'active' | 'inactive' | 'transferred';
  assigned_date: string;
}

export interface ProctorPlacement {
  id: number;
  proctor_id: string;
  block: string;
  year: string;
  first_entry: string;
  status: 'active' | 'inactive';
}

export interface Request {
  id: number;
  student_id: string;
  type: 'room_change' | 'maintenance' | 'complaint' | 'other';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_date: string;
  resolved_date?: string;
  resolved_by?: string;
}

export interface Emergency {
  id: number;
  student_id: string;
  type: 'medical' | 'security' | 'fire' | 'other';
  description: string;
  status: 'reported' | 'in_progress' | 'resolved';
  reported_date: string;
  resolved_date?: string;
}

export interface Material {
  id: number;
  student_id: string;
  room: string;
  block: string;
  item_name: string;
  quantity: number;
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  registered_date: string;
}

export interface ExitPaper {
  id: number;
  student_id: string;
  exit_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'printed';
  created_date: string;
  approved_by?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target_audience: 'all' | 'students' | 'staff' | 'proctors';
  created_date: string;
  expires_date?: string;
  is_active: boolean;
}

// UI and Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  roles?: Employee['role'][];
}

export interface DashboardStats {
  total_students: number;
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
  pending_requests: number;
  active_emergencies: number;
}

// Form types
export interface LoginForm {
  id: string;
  password: string;
  role: Employee['role'];
}

export interface StudentRegistrationForm {
  student_id: string;
  first_name: string;
  second_name: string;
  last_name: string;
  email: string;
  gender: Student['gender'];
  batch: string;
  disability_status: Student['disability_status'];
}

export interface RoomAssignmentForm {
  student_id: string;
  room: string;
  block: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}