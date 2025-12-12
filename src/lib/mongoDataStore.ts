// MongoDB data store using Mongoose models
import connectDB from './mongoose';
import Student from '@/models/mongoose/Student';
import Employee from '@/models/mongoose/Employee';
import Block from '@/models/mongoose/Block';
import Room from '@/models/mongoose/Room';
import StudentPlacement from '@/models/mongoose/StudentPlacement';
import Request from '@/models/mongoose/Request';
import Emergency from '@/models/mongoose/Emergency';
import Notification from '@/models/mongoose/Notification';
import Material from '@/models/mongoose/Material';
import { hashPassword } from './auth';
import { 
  sampleStudents, 
  sampleEmployees, 
  sampleBlocks, 
  sampleRooms,
  sampleStudentPlacements,
  sampleRequests,
  sampleEmergencies,
  sampleNotifications
} from '@/data/sampleData';

class MongoDataStore {
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    await connectDB();
    await this.seedDataIfEmpty();
    this.initialized = true;
  }

  async forceReseed() {
    await connectDB();
    console.log('🌱 ADMIN TRIGGERED: Force reseeding database...');
    
    // Clear existing data
    await Student.deleteMany({});
    await Employee.deleteMany({});
    await Block.deleteMany({});
    await Room.deleteMany({});
    await StudentPlacement.deleteMany({});
    await Request.deleteMany({});
    await Emergency.deleteMany({});
    await Notification.deleteMany({});
    
    // Also clear emergency contacts if the model exists
    try {
      const EmergencyContact = (await import('@/models/mongoose/EmergencyContact')).default;
      await EmergencyContact.deleteMany({});
    } catch (error) {
      console.log('EmergencyContact model not available, skipping...');
    }

    // Seed with sample data
    await this.seedSampleData();
    
    this.initialized = true;
    console.log('✅ ADMIN RESEED: Database reseeded successfully');
  }

  private async seedSampleData() {
    console.log('Seeding database with sample data...');

    // Seed Employees with hashed passwords (all use "default123")
    const employees = sampleEmployees.map(emp => ({
      ...emp,
      password: hashPassword('default123')
    }));
    await Employee.insertMany(employees);

    // Seed Students with hashed passwords (all use "default123")
    const students = sampleStudents.map(student => ({
      ...student,
      password: hashPassword('default123')
    }));
    await Student.insertMany(students);

    // Seed other data
    await Block.insertMany(sampleBlocks);
    await Room.insertMany(sampleRooms);
    await StudentPlacement.insertMany(sampleStudentPlacements);
    await Request.insertMany(sampleRequests);
    await Emergency.insertMany(sampleEmergencies);
    await Notification.insertMany(sampleNotifications);
  }

  private async seedDataIfEmpty() {
    try {
      // Check if data already exists
      const studentCount = await Student.countDocuments();
      const employeeCount = await Employee.countDocuments();
      
      // PRODUCTION FIX: Only seed if database is completely empty
      if (studentCount > 0 || employeeCount > 0) {
        console.log(`Database already has data (${studentCount} students, ${employeeCount} employees) - skipping seed`);
        return; // Data already exists, don't reseed
      }

      // Only seed if database is completely empty
      await this.seedSampleData();

      // Seed Emergency Contacts (additional to what's in seedSampleData)
      try {
        const EmergencyContact = (await import('@/models/mongoose/EmergencyContact')).default;
        const { sampleEmergencyContacts } = await import('@/data/sampleData');
        await EmergencyContact.insertMany(sampleEmergencyContacts);
        console.log('Emergency contacts seeded successfully!');
      } catch (error) {
        console.log('Could not seed emergency contacts:', error);
      }

      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  // Students CRUD
  async getStudents() {
    await this.init();
    return await Student.find().lean();
  }

  async getStudent(studentId: string) {
    await this.init();
    return await Student.findOne({ student_id: studentId }).select('+password').lean();
  }

  async getStudentById(mongoId: string) {
    await this.init();
    return await Student.findById(mongoId).select('+password').lean();
  }

  async createStudent(studentData: any) {
    await this.init();
    const student = new Student(studentData);
    return await student.save();
  }

  async updateStudent(studentId: string, updates: any) {
    await this.init();
    return await Student.findOneAndUpdate(
      { student_id: studentId },
      updates,
      { new: true }
    ).lean();
  }

  async updateStudentById(mongoId: string, updates: any) {
    await this.init();
    return await Student.findByIdAndUpdate(
      mongoId,
      updates,
      { new: true }
    ).lean();
  }

  async deleteStudent(studentId: string) {
    await this.init();
    // Also remove their placement
    await StudentPlacement.deleteOne({ student_id: studentId });
    const result = await Student.deleteOne({ student_id: studentId });
    return result.deletedCount > 0;
  }

  async deleteStudentById(mongoId: string) {
    await this.init();
    // First get the student to find their student_id for placement removal
    const student = await Student.findById(mongoId);
    if (student) {
      await StudentPlacement.deleteOne({ student_id: student.student_id });
    }
    const result = await Student.findByIdAndDelete(mongoId);
    return !!result;
  }

  async activateAllStudents() {
    await this.init();
    const result = await Student.updateMany(
      { status: 'inactive' },
      { status: 'active' }
    );
    return result.modifiedCount;
  }

  async deactivateAllStudents() {
    await this.init();
    const result = await Student.updateMany(
      { status: 'active' },
      { status: 'inactive' }
    );
    return result.modifiedCount;
  }

  // Employees CRUD
  async getEmployees() {
    await this.init();
    return await Employee.find().lean();
  }

  async getEmployee(employeeId: string) {
    await this.init();
    return await Employee.findOne({ employee_id: employeeId }).select('+password').lean();
  }

  async createEmployee(employeeData: any) {
    await this.init();
    
    // Hash the password if provided
    if (employeeData.password) {
      employeeData.password = hashPassword(employeeData.password);
    }
    
    const employee = new Employee(employeeData);
    return await employee.save();
  }

  async updateEmployee(employeeId: string, updates: any) {
    await this.init();
    return await Employee.findOneAndUpdate(
      { employee_id: employeeId },
      updates,
      { new: true }
    ).lean();
  }

  async deleteEmployee(employeeId: string) {
    await this.init();
    const result = await Employee.deleteOne({ employee_id: employeeId });
    return result.deletedCount > 0;
  }

  async getEmployeeById(employeeId: string) {
    await this.init();
    return await Employee.findOne({ employee_id: employeeId }).lean();
  }

  // Rooms CRUD
  async getRooms() {
    await this.init();
    return await Room.find().lean();
  }

  async getRoom(roomId: string, block: string) {
    await this.init();
    return await Room.findOne({ room_id: roomId, block }).lean();
  }

  async createRoom(roomData: any) {
    await this.init();
    const room = new Room(roomData);
    return await room.save();
  }

  async updateRoom(roomId: string, block: string, updates: any) {
    await this.init();
    return await Room.findOneAndUpdate(
      { room_id: roomId, block },
      updates,
      { new: true }
    ).lean();
  }

  async getAvailableRooms(block?: string) {
    await this.init();
    const query: any = { status: 'available' };
    if (block) query.block = block;
    return await Room.find(query).lean();
  }

  // Blocks CRUD
  async getBlocks() {
    await this.init();
    return await Block.find().lean();
  }

  async getBlock(blockId: string) {
    await this.init();
    return await Block.findOne({ block_id: blockId }).lean();
  }

  async createBlock(blockData: any) {
    await this.init();
    
    // Calculate total capacity
    const totalCapacity = blockData.floors * blockData.rooms_per_floor * blockData.room_capacity;
    
    const block = new Block({
      ...blockData,
      capacity: totalCapacity,
      occupied: 0
    });
    
    const savedBlock = await block.save();
    
    // Generate rooms automatically
    await this.generateRoomsForBlock(savedBlock);
    
    return savedBlock;
  }

  private async generateRoomsForBlock(block: any) {
    const rooms = [];
    
    for (let floor = 0; floor < block.floors; floor++) {
      for (let roomNum = 1; roomNum <= block.rooms_per_floor; roomNum++) {
        const roomNumber = `${roomNum.toString().padStart(2, '0')}`;
        const roomId = `${block.block_id}${floor}${roomNumber}`;
        
        // Ground floor (floor 0) rooms are disability accessible
        const isDisabilityAccessible = floor === 0;
        
        rooms.push({
          room_id: roomId,
          block: block.block_id,
          floor: floor,
          room_number: roomNumber,
          status: 'available',
          capacity: block.room_capacity,
          current_occupancy: 0,
          disability_accessible: isDisabilityAccessible
        });
      }
    }
    
    if (rooms.length > 0) {
      await Room.insertMany(rooms);
    }
  }

  async updateBlock(blockId: string, updates: any) {
    await this.init();
    return await Block.findOneAndUpdate(
      { block_id: blockId },
      updates,
      { new: true }
    ).lean();
  }

  async deleteBlock(blockId: string) {
    await this.init();
    const result = await Block.deleteOne({ block_id: blockId });
    return result.deletedCount > 0;
  }

  async getBlockById(blockId: string) {
    await this.init();
    return await Block.findOne({ block_id: blockId }).lean();
  }

  // Student Placements CRUD
  async getStudentPlacements() {
    await this.init();
    return await StudentPlacement.find().lean();
  }

  async getStudentPlacement(studentId: string) {
    await this.init();
    return await StudentPlacement.findOne({ student_id: studentId }).lean();
  }

  async createStudentPlacement(placementData: any) {
    await this.init();
    const placement = new StudentPlacement(placementData);
    return await placement.save();
  }

  async updateStudentPlacement(id: number, updates: any) {
    await this.init();
    return await StudentPlacement.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async deleteStudentPlacement(studentId: string) {
    await this.init();
    const result = await StudentPlacement.deleteOne({ student_id: studentId });
    return result.deletedCount > 0;
  }

  async unassignAllStudents() {
    await this.init();
    const count = await StudentPlacement.countDocuments();
    await StudentPlacement.deleteMany({});
    
    // Update all students to 'active' status
    await Student.updateMany({}, { status: 'active' });
    
    // Update all rooms to 'available' status
    await Room.updateMany({}, { status: 'available', current_occupancy: 0 });
    
    return count;
  }

  // Requests CRUD
  async getRequests() {
    await this.init();
    return await Request.find().sort({ created_date: -1 }).lean();
  }

  async getRequest(id: number) {
    await this.init();
    return await Request.findById(id).lean();
  }

  async createRequest(requestData: any) {
    await this.init();
    const request = new Request(requestData);
    return await request.save();
  }

  async updateRequest(id: number, updates: any) {
    await this.init();
    return await Request.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async deleteRequest(id: number) {
    await this.init();
    const result = await Request.findByIdAndDelete(id);
    return !!result;
  }

  // Emergencies CRUD
  async getEmergencies() {
    await this.init();
    return await Emergency.find().sort({ reported_date: -1 }).lean();
  }

  async createEmergency(emergencyData: any) {
    await this.init();
    console.log('🏗️ Creating emergency with data:', JSON.stringify(emergencyData, null, 2));
    
    try {
      const emergency = new Emergency(emergencyData);
      console.log('📝 Emergency model created, saving...');
      const result = await emergency.save();
      console.log('✅ Emergency saved successfully:', result._id);
      return result;
    } catch (error: any) {
      console.error('❌ Error in createEmergency:', error);
      console.error('📋 Emergency data that failed:', emergencyData);
      throw error;
    }
  }

  async updateEmergency(id: number, updates: any) {
    await this.init();
    return await Emergency.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  // Notifications CRUD
  async getNotifications() {
    await this.init();
    return await Notification.find({ is_active: true }).sort({ created_date: -1 }).lean();
  }

  async createNotification(notificationData: any) {
    await this.init();
    const notification = new Notification(notificationData);
    return await notification.save();
  }

  async updateNotification(id: number, updates: any) {
    await this.init();
    return await Notification.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async deleteNotification(id: number) {
    await this.init();
    const result = await Notification.findByIdAndDelete(id);
    return !!result;
  }

  // Search functionality
  async searchStudents(query: string) {
    await this.init();
    const regex = new RegExp(query, 'i');
    return await Student.find({
      $or: [
        { student_id: regex },
        { first_name: regex },
        { last_name: regex },
        { email: regex }
      ]
    }).lean();
  }

  async searchPlacements(query: string) {
    await this.init();
    const regex = new RegExp(query, 'i');
    return await StudentPlacement.find({
      $or: [
        { student_id: regex },
        { room: regex },
        { block: regex }
      ]
    }).lean();
  }

  // Statistics
  async getStatistics() {
    await this.init();
    
    const [
      totalStudents,
      activeStudents,
      totalRooms,
      occupiedRooms,
      availableRooms,
      pendingRequests,
      activeEmergencies,
      placedStudents
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'active' }),
      Room.countDocuments(),
      Room.countDocuments({ status: 'occupied' }),
      Room.countDocuments({ status: 'available' }),
      Request.countDocuments({ status: 'pending' }),
      Emergency.countDocuments({ status: { $ne: 'resolved' } }),
      StudentPlacement.countDocuments({ status: 'active' })
    ]);

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

  // Auto-assign students logic
  async autoAssignStudents() {
    await this.init();
    
    const unassignedStudents = await Student.find({
      status: 'active',
      student_id: { $nin: await StudentPlacement.distinct('student_id') }
    }).lean();

    let assigned = 0;
    const errors: string[] = [];

    for (const student of unassignedStudents) {
      const result = await this.assignStudentToRoom(student);
      if (result.success) {
        assigned++;
      } else {
        errors.push(`${student.student_id}: ${result.error}`);
      }
    }

    return { assigned, errors };
  }

  // Auto-assign specific student
  async autoAssignSpecificStudent(studentId: string) {
    await this.init();
    
    const student = await Student.findOne({ student_id: studentId, status: 'active' }).lean();
    if (!student) {
      return { success: false, error: 'Student not found or not active' };
    }

    // Check if already assigned
    const existingPlacement = await StudentPlacement.findOne({ student_id: studentId }).lean();
    if (existingPlacement) {
      return { success: false, error: 'Student already has a placement' };
    }

    return await this.assignStudentToRoom(student);
  }

  // Manual assignment with validation
  async manualAssignStudent(studentId: string, blockId: string, roomId: string) {
    await this.init();
    
    try {
      // Validate student
      const student = await Student.findOne({ student_id: studentId, status: 'active' }).lean();
      if (!student) {
        return { success: false, error: 'Student not found or not active' };
      }

      // Check if already assigned
      const existingPlacement = await StudentPlacement.findOne({ student_id: studentId }).lean();
      if (existingPlacement) {
        return { success: false, error: 'Student already has a placement' };
      }

      // Validate block
      const block = await Block.findOne({ block_id: blockId, status: 'active' }).lean();
      if (!block) {
        return { success: false, error: 'Block not found or not active' };
      }

      // Validate room
      const room = await Room.findOne({ room_id: roomId, block: blockId }).lean();
      if (!room) {
        return { success: false, error: 'Room not found in specified block' };
      }

      // Check room availability
      if (room.status !== 'available' || (room.current_occupancy || 0) >= room.capacity) {
        return { success: false, error: 'Room is not available or at full capacity' };
      }

      // Validate gender matching
      if (block.reserved_for !== student.gender) {
        return { success: false, error: `Block is reserved for ${block.reserved_for} students` };
      }

      // Validate disability accessibility
      if (student.disability_status !== 'none' && !room.disability_accessible) {
        return { success: false, error: 'Student with disability needs an accessible room' };
      }

      // Create placement
      await this.createStudentPlacement({
        student_id: studentId,
        room: roomId,
        block: blockId,
        year: new Date().getFullYear().toString(),
        status: 'active',
        assigned_date: new Date()
      });

      // Update room occupancy
      const newOccupancy = (room.current_occupancy || 0) + 1;
      await this.updateRoom(roomId, blockId, {
        current_occupancy: newOccupancy,
        status: newOccupancy >= room.capacity ? 'occupied' : 'available'
      });

      return { success: true };
    } catch (error) {
      console.error('Manual assignment error:', error);
      return { success: false, error: 'Database error during assignment' };
    }
  }

  private async assignStudentToRoom(student: any) {
    try {
      // Find suitable blocks based on gender
      const suitableBlocks = await Block.find({
        reserved_for: student.gender,
        status: 'active'
      }).lean();

      if (suitableBlocks.length === 0) {
        return { success: false, error: 'No suitable blocks available for this gender' };
      }

      // Find available rooms in suitable blocks with enhanced logic
      for (const block of suitableBlocks) {
        let roomQuery: any = {
          block: block.block_id,
          status: 'available',
          $expr: { $lt: ['$current_occupancy', '$capacity'] }
        };

        // Enhanced disability logic
        if (student.disability_status !== 'none') {
          // Students with disabilities need accessible rooms (ground floor)
          roomQuery.disability_accessible = true;
        } else {
          // Normal students can use any available room
          // Including non-ground floors in disability blocks
          // No additional restrictions needed
        }

        const availableRooms = await Room.find(roomQuery).lean();

        if (availableRooms.length > 0) {
          // Prioritize accessible rooms for students with disabilities
          // For normal students, prefer non-accessible rooms first to save accessible ones
          let room;
          if (student.disability_status !== 'none') {
            room = availableRooms[0]; // Any accessible room
          } else {
            // Prefer non-accessible rooms first
            room = availableRooms.find(r => !r.disability_accessible) || availableRooms[0];
          }
          
          // Create placement
          await this.createStudentPlacement({
            student_id: student.student_id,
            room: room.room_id,
            block: room.block,
            year: new Date().getFullYear().toString(),
            status: 'active',
            assigned_date: new Date()
          });

          // Update room occupancy
          const newOccupancy = (room.current_occupancy || 0) + 1;
          await this.updateRoom(room.room_id, room.block, {
            current_occupancy: newOccupancy,
            status: newOccupancy >= room.capacity ? 'occupied' : 'available'
          });

          return { success: true };
        }
      }

      return { success: false, error: 'No available rooms found' };
    } catch (error) {
      console.error('Assignment error:', error);
      return { success: false, error: 'Database error during assignment' };
    }
  }

  // Materials CRUD
  async getMaterials() {
    await this.init();
    return await Material.find().lean();
  }

  async getMaterialsByBlock(block: string) {
    await this.init();
    return await Material.find({ block }).lean();
  }

  async getMaterial(id: string) {
    await this.init();
    return await Material.findById(id).lean();
  }

  async createMaterial(materialData: any) {
    await this.init();
    const material = new Material(materialData);
    return await material.save();
  }

  async updateMaterial(id: string, updates: any) {
    await this.init();
    return await Material.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async deleteMaterial(id: string) {
    await this.init();
    const result = await Material.findByIdAndDelete(id);
    return !!result;
  }
}

// Create singleton instance
const mongoDataStore = new MongoDataStore();

export { mongoDataStore };
export default mongoDataStore;