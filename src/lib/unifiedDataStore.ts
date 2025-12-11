// Unified data store that switches between in-memory and MongoDB based on environment
import dataStore from './dataStore';
import mongoDataStore from './mongoDataStore';

const isDemoMode = process.env.DEMO_MODE === 'true';

// Create a unified interface that delegates to the appropriate store
const unifiedDataStore = {
  // Students
  getStudents: () => isDemoMode ? dataStore.getStudents() : mongoDataStore.getStudents(),
  getStudent: (id: string) => isDemoMode ? dataStore.getStudent(id) : mongoDataStore.getStudent(id),
  createStudent: (data: any) => isDemoMode ? dataStore.createStudent(data) : mongoDataStore.createStudent(data),
  updateStudent: (id: string, updates: any) => isDemoMode ? dataStore.updateStudent(id, updates) : mongoDataStore.updateStudent(id, updates),
  deleteStudent: (id: string) => isDemoMode ? dataStore.deleteStudent(id) : mongoDataStore.deleteStudent(id),
  activateAllStudents: () => isDemoMode ? dataStore.activateAllStudents() : mongoDataStore.activateAllStudents(),
  deactivateAllStudents: () => isDemoMode ? dataStore.deactivateAllStudents() : mongoDataStore.deactivateAllStudents(),

  // Employees
  getEmployees: () => isDemoMode ? dataStore.getEmployees() : mongoDataStore.getEmployees(),
  getEmployee: (id: string) => isDemoMode ? dataStore.getEmployee(id) : mongoDataStore.getEmployee(id),
  createEmployee: (data: any) => isDemoMode ? dataStore.createEmployee(data) : mongoDataStore.createEmployee(data),
  updateEmployee: (id: string, updates: any) => isDemoMode ? dataStore.updateEmployee(id, updates) : mongoDataStore.updateEmployee(id, updates),
  deleteEmployee: (id: string) => isDemoMode ? dataStore.deleteEmployee(id) : mongoDataStore.deleteEmployee(id),

  // Rooms
  getRooms: () => isDemoMode ? dataStore.getRooms() : mongoDataStore.getRooms(),
  getRoom: (roomId: string, block: string) => isDemoMode ? dataStore.getRoom(roomId, block) : mongoDataStore.getRoom(roomId, block),
  updateRoom: (roomId: string, block: string, updates: any) => isDemoMode ? dataStore.updateRoom(roomId, block, updates) : mongoDataStore.updateRoom(roomId, block, updates),
  getAvailableRooms: (block?: string) => isDemoMode ? dataStore.getAvailableRooms(block) : mongoDataStore.getAvailableRooms(block),

  // Blocks
  getBlocks: () => isDemoMode ? dataStore.getBlocks() : mongoDataStore.getBlocks(),
  getBlock: (id: string) => isDemoMode ? dataStore.getBlock(id) : mongoDataStore.getBlock(id),
  createBlock: (data: any) => isDemoMode ? dataStore.createBlock(data) : mongoDataStore.createBlock(data),
  updateBlock: (id: string, updates: any) => isDemoMode ? dataStore.updateBlock(id, updates) : mongoDataStore.updateBlock(id, updates),
  deleteBlock: (id: string) => isDemoMode ? dataStore.deleteBlock(id) : mongoDataStore.deleteBlock(id),

  // Student Placements
  getStudentPlacements: () => isDemoMode ? dataStore.getStudentPlacements() : mongoDataStore.getStudentPlacements(),
  getStudentPlacement: (id: string) => isDemoMode ? dataStore.getStudentPlacement(id) : mongoDataStore.getStudentPlacement(id),
  createStudentPlacement: (data: any) => isDemoMode ? dataStore.createStudentPlacement(data) : mongoDataStore.createStudentPlacement(data),
  updateStudentPlacement: (id: number, updates: any) => isDemoMode ? dataStore.updateStudentPlacement(id, updates) : mongoDataStore.updateStudentPlacement(id, updates),
  deleteStudentPlacement: (id: string) => isDemoMode ? dataStore.deleteStudentPlacement(id) : mongoDataStore.deleteStudentPlacement(id),
  unassignAllStudents: () => isDemoMode ? dataStore.unassignAllStudents() : mongoDataStore.unassignAllStudents(),
  autoAssignStudents: () => isDemoMode ? dataStore.autoAssignStudents() : mongoDataStore.autoAssignStudents(),
  autoAssignSpecificStudent: (studentId: string) => isDemoMode ? dataStore.autoAssignSpecificStudent?.(studentId) || { success: false, error: 'Not implemented in demo mode' } : mongoDataStore.autoAssignSpecificStudent(studentId),
  manualAssignStudent: (studentId: string, blockId: string, roomId: string) => isDemoMode ? dataStore.manualAssignStudent?.(studentId, blockId, roomId) || { success: false, error: 'Not implemented in demo mode' } : mongoDataStore.manualAssignStudent(studentId, blockId, roomId),

  // Requests
  getRequests: () => isDemoMode ? dataStore.getRequests() : mongoDataStore.getRequests(),
  getRequest: (id: number) => isDemoMode ? dataStore.getRequest(id) : mongoDataStore.getRequest(id),
  createRequest: (data: any) => isDemoMode ? dataStore.createRequest(data) : mongoDataStore.createRequest(data),
  updateRequest: (id: number, updates: any) => isDemoMode ? dataStore.updateRequest(id, updates) : mongoDataStore.updateRequest(id, updates),
  deleteRequest: (id: number) => isDemoMode ? dataStore.deleteRequest(id) : mongoDataStore.deleteRequest(id),

  // Emergencies
  getEmergencies: () => isDemoMode ? dataStore.getEmergencies() : mongoDataStore.getEmergencies(),
  createEmergency: (data: any) => isDemoMode ? dataStore.createEmergency(data) : mongoDataStore.createEmergency(data),
  updateEmergency: (id: number, updates: any) => isDemoMode ? dataStore.updateEmergency(id, updates) : mongoDataStore.updateEmergency(id, updates),

  // Notifications
  getNotifications: () => isDemoMode ? dataStore.getNotifications() : mongoDataStore.getNotifications(),
  createNotification: (data: any) => isDemoMode ? dataStore.createNotification(data) : mongoDataStore.createNotification(data),
  updateNotification: (id: number, updates: any) => isDemoMode ? dataStore.updateNotification(id, updates) : mongoDataStore.updateNotification(id, updates),
  deleteNotification: (id: number) => isDemoMode ? dataStore.deleteNotification(id) : mongoDataStore.deleteNotification(id),

  // Search
  searchStudents: (query: string) => isDemoMode ? dataStore.searchStudents(query) : mongoDataStore.searchStudents(query),
  searchPlacements: (query: string) => isDemoMode ? dataStore.searchPlacements(query) : mongoDataStore.searchPlacements(query),

  // Statistics
  getStatistics: () => isDemoMode ? dataStore.getStatistics() : mongoDataStore.getStatistics(),

  // Materials
  getMaterials: () => isDemoMode ? Promise.resolve([]) : mongoDataStore.getMaterials(),
  getMaterialsByBlock: (block: string) => isDemoMode ? Promise.resolve([]) : mongoDataStore.getMaterialsByBlock(block),
  getMaterial: (id: string) => isDemoMode ? Promise.resolve(null) : mongoDataStore.getMaterial(id),
  createMaterial: (data: any) => isDemoMode ? Promise.resolve(null) : mongoDataStore.createMaterial(data),
  updateMaterial: (id: string, updates: any) => isDemoMode ? Promise.resolve(null) : mongoDataStore.updateMaterial(id, updates),
  deleteMaterial: (id: string) => isDemoMode ? Promise.resolve(false) : mongoDataStore.deleteMaterial(id),
};

export default unifiedDataStore;