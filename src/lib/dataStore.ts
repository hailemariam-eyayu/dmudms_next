// In-memory data store that simulates a database
// In production, this would be replaced with a real database

import { 
  Student, 
  Room, 
  Block, 
  Employee, 
  StudentPlacement, 
  ProctorPlacement,
  Request,
  Emergency,
  Notification,
  Material,
  ExitPaper
} from '@/types';

import {
  sampleStudents,
  sampleRooms,
  sampleBlocks,
  sampleEmployees,
  sampleStudentPlacements,
  sampleProctorPlacements,
  sampleRequests,
  sampleEmergencies,
  sampleNotifications
} from '@/data/sampleData';

// Data store class
class DataStore {
  private students: Student[] = [...sampleStudents];
  private rooms: Room[] = [...sampleRooms];
  private blocks: Block[] = [...sampleBlocks];
  private employees: Employee[] = [...sampleEmployees];
  private studentPlacements: StudentPlacement[] = [...sampleStudentPlacements];
  private proctorPlacements: ProctorPlacement[] = [...sampleProctorPlacements];
  private requests: Request[] = [...sampleRequests];
  private emergencies: Emergency[] = [...sampleEmergencies];
  private notifications: Notification[] = [...sampleNotifications];
  private materials: Material[] = [];
  private exitPapers: ExitPaper[] = [];

  // Students CRUD
  getStudents(): Student[] {
    return this.students;
  }

  getStudent(studentId: string): Student | undefined {
    return this.students.find(s => s.student_id === studentId);
  }

  createStudent(student: Omit<Student, 'password'>): Student {
    const newStudent: Student = {
      ...student,
      password: 'default123' // Default password
    };
    this.students.push(newStudent);
    return newStudent;
  }

  updateStudent(studentId: string, updates: Partial<Student>): Student | null {
    const index = this.students.findIndex(s => s.student_id === studentId);
    if (index === -1) return null;
    
    this.students[index] = { ...this.students[index], ...updates };
    return this.students[index];
  }

  deleteStudent(studentId: string): boolean {
    const index = this.students.findIndex(s => s.student_id === studentId);
    if (index === -1) return false;
    
    // Also remove their placement
    this.studentPlacements = this.studentPlacements.filter(p => p.student_id !== studentId);
    this.students.splice(index, 1);
    return true;
  }

  activateAllStudents(): number {
    let count = 0;
    this.students.forEach(student => {
      if (student.status === 'inactive') {
        student.status = 'active';
        count++;
      }
    });
    return count;
  }

  deactivateAllStudents(): number {
    let count = 0;
    this.students.forEach(student => {
      if (student.status === 'active') {
        student.status = 'inactive';
        count++;
      }
    });
    return count;
  }

  // Rooms CRUD
  getRooms(): Room[] {
    return this.rooms;
  }

  getRoom(roomId: string, block: string): Room | undefined {
    return this.rooms.find(r => r.room_id === roomId && r.block === block);
  }

  updateRoom(roomId: string, block: string, updates: Partial<Room>): Room | null {
    const index = this.rooms.findIndex(r => r.room_id === roomId && r.block === block);
    if (index === -1) return null;
    
    this.rooms[index] = { ...this.rooms[index], ...updates };
    return this.rooms[index];
  }

  getAvailableRooms(block?: string): Room[] {
    let rooms = this.rooms.filter(r => r.status === 'available');
    if (block) {
      rooms = rooms.filter(r => r.block === block);
    }
    return rooms;
  }

  // Blocks CRUD
  getBlocks(): Block[] {
    return this.blocks;
  }

  getBlock(blockId: string): Block | undefined {
    return this.blocks.find(b => b.block_id === blockId);
  }

  createBlock(block: Block): Block {
    this.blocks.push(block);
    return block;
  }

  updateBlock(blockId: string, updates: Partial<Block>): Block | null {
    const index = this.blocks.findIndex(b => b.block_id === blockId);
    if (index === -1) return null;
    
    this.blocks[index] = { ...this.blocks[index], ...updates };
    return this.blocks[index];
  }

  deleteBlock(blockId: string): boolean {
    const index = this.blocks.findIndex(b => b.block_id === blockId);
    if (index === -1) return false;
    
    this.blocks.splice(index, 1);
    return true;
  }

  // Student Placements CRUD
  getStudentPlacements(): StudentPlacement[] {
    return this.studentPlacements;
  }

  getStudentPlacement(studentId: string): StudentPlacement | undefined {
    return this.studentPlacements.find(p => p.student_id === studentId);
  }

  createStudentPlacement(placement: Omit<StudentPlacement, 'id'>): StudentPlacement {
    const newPlacement: StudentPlacement = {
      ...placement,
      id: Math.max(...this.studentPlacements.map(p => p.id), 0) + 1
    };
    this.studentPlacements.push(newPlacement);
    return newPlacement;
  }

  updateStudentPlacement(id: number, updates: Partial<StudentPlacement>): StudentPlacement | null {
    const index = this.studentPlacements.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.studentPlacements[index] = { ...this.studentPlacements[index], ...updates };
    return this.studentPlacements[index];
  }

  deleteStudentPlacement(studentId: string): boolean {
    const index = this.studentPlacements.findIndex(p => p.student_id === studentId);
    if (index === -1) return false;
    
    this.studentPlacements.splice(index, 1);
    return true;
  }

  unassignAllStudents(): number {
    const count = this.studentPlacements.length;
    this.studentPlacements = [];
    
    // Update all students to 'active' status
    this.students.forEach(student => {
      if (student.status === 'inactive') {
        student.status = 'active';
      }
    });
    
    // Update all rooms to 'available' status
    this.rooms.forEach(room => {
      if (room.status === 'occupied') {
        room.status = 'available';
        room.current_occupancy = 0;
      }
    });
    
    return count;
  }

  // Auto-assign students logic
  autoAssignStudents(): { assigned: number; errors: string[] } {
    const unassignedStudents = this.students.filter(s => 
      s.status === 'active' && 
      !this.studentPlacements.some(p => p.student_id === s.student_id)
    );

    let assigned = 0;
    const errors: string[] = [];

    for (const student of unassignedStudents) {
      const result = this.assignStudentToRoom(student);
      if (result.success) {
        assigned++;
      } else {
        errors.push(`${student.student_id}: ${result.error}`);
      }
    }

    return { assigned, errors };
  }

  private assignStudentToRoom(student: Student): { success: boolean; error?: string } {
    // Find suitable blocks
    let suitableBlocks = this.blocks.filter(block => {
      // Gender check
      if (block.reserved_for !== student.gender && block.reserved_for !== 'mixed') {
        return false;
      }
      
      // Disability check
      if (student.disability_status !== 'none' && !block.disable_group) {
        return false;
      }
      
      return block.status === 'active';
    });

    if (suitableBlocks.length === 0) {
      return { success: false, error: 'No suitable blocks available' };
    }

    // Find available rooms in suitable blocks
    for (const block of suitableBlocks) {
      const availableRooms = this.rooms.filter(room => 
        room.block === block.block_id && 
        room.status === 'available' &&
        (room.current_occupancy || 0) < room.capacity
      );

      if (availableRooms.length > 0) {
        const room = availableRooms[0];
        
        // Create placement
        this.createStudentPlacement({
          student_id: student.student_id,
          room: room.room_id,
          block: room.block,
          year: new Date().getFullYear().toString(),
          status: 'active',
          assigned_date: new Date().toISOString().split('T')[0]
        });

        // Update room occupancy
        const newOccupancy = (room.current_occupancy || 0) + 1;
        this.updateRoom(room.room_id, room.block, {
          current_occupancy: newOccupancy,
          status: newOccupancy >= room.capacity ? 'occupied' : 'available'
        });

        return { success: true };
      }
    }

    return { success: false, error: 'No available rooms found' };
  }

  // Requests CRUD
  getRequests(): Request[] {
    return this.requests;
  }

  getRequest(id: number): Request | undefined {
    return this.requests.find(r => r.id === id);
  }

  createRequest(request: Omit<Request, 'id'>): Request {
    const newRequest: Request = {
      ...request,
      id: Math.max(...this.requests.map(r => r.id), 0) + 1
    };
    this.requests.push(newRequest);
    return newRequest;
  }

  updateRequest(id: number, updates: Partial<Request>): Request | null {
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    this.requests[index] = { ...this.requests[index], ...updates };
    return this.requests[index];
  }

  deleteRequest(id: number): boolean {
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.requests.splice(index, 1);
    return true;
  }

  // Emergencies CRUD
  getEmergencies(): Emergency[] {
    return this.emergencies;
  }

  createEmergency(emergency: Omit<Emergency, 'id'>): Emergency {
    const newEmergency: Emergency = {
      ...emergency,
      id: Math.max(...this.emergencies.map(e => e.id), 0) + 1
    };
    this.emergencies.push(newEmergency);
    return newEmergency;
  }

  updateEmergency(id: number, updates: Partial<Emergency>): Emergency | null {
    const index = this.emergencies.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    this.emergencies[index] = { ...this.emergencies[index], ...updates };
    return this.emergencies[index];
  }

  // Notifications CRUD
  getNotifications(): Notification[] {
    return this.notifications.filter(n => n.is_active);
  }

  createNotification(notification: Omit<Notification, 'id'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Math.max(...this.notifications.map(n => n.id), 0) + 1
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  updateNotification(id: number, updates: Partial<Notification>): Notification | null {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    this.notifications[index] = { ...this.notifications[index], ...updates };
    return this.notifications[index];
  }

  deleteNotification(id: number): boolean {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index === -1) return false;
    
    this.notifications.splice(index, 1);
    return true;
  }

  // Employees CRUD
  getEmployees(): Employee[] {
    return this.employees;
  }

  getEmployee(employeeId: string): Employee | undefined {
    return this.employees.find(e => e.employee_id === employeeId);
  }

  createEmployee(employee: Omit<Employee, 'password'>): Employee {
    const newEmployee: Employee = {
      ...employee,
      password: 'default123'
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  updateEmployee(employeeId: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex(e => e.employee_id === employeeId);
    if (index === -1) return null;
    
    this.employees[index] = { ...this.employees[index], ...updates };
    return this.employees[index];
  }

  deleteEmployee(employeeId: string): boolean {
    const index = this.employees.findIndex(e => e.employee_id === employeeId);
    if (index === -1) return false;
    
    this.employees.splice(index, 1);
    return true;
  }

  // Search functionality
  searchStudents(query: string): Student[] {
    const lowercaseQuery = query.toLowerCase();
    return this.students.filter(student =>
      student.student_id.toLowerCase().includes(lowercaseQuery) ||
      student.first_name.toLowerCase().includes(lowercaseQuery) ||
      student.last_name.toLowerCase().includes(lowercaseQuery) ||
      student.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  searchPlacements(query: string): StudentPlacement[] {
    const lowercaseQuery = query.toLowerCase();
    return this.studentPlacements.filter(placement =>
      placement.student_id.toLowerCase().includes(lowercaseQuery) ||
      placement.room.toLowerCase().includes(lowercaseQuery) ||
      placement.block.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Statistics
  getStatistics() {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.status === 'active').length;
    const totalRooms = this.rooms.length;
    const occupiedRooms = this.rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = this.rooms.filter(r => r.status === 'available').length;
    const pendingRequests = this.requests.filter(r => r.status === 'pending').length;
    const activeEmergencies = this.emergencies.filter(e => e.status !== 'resolved').length;
    const placedStudents = this.studentPlacements.filter(p => p.status === 'active').length;

    return {
      total_students: totalStudents,
      active_students: activeStudents,
      total_rooms: totalRooms,
      occupied_rooms: occupiedRooms,
      available_rooms: availableRooms,
      pending_requests: pendingRequests,
      active_emergencies: activeEmergencies,
      placed_students: placedStudents,
      occupancy_rate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
    };
  }
}

// Create singleton instance
const dataStore = new DataStore();

export default dataStore;