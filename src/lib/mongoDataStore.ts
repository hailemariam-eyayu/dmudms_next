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

  private async seedDataIfEmpty() {
    try {
      // Check if data already exists
      const studentCount = await Student.countDocuments();
      if (studentCount > 0) return; // Data already exists

      console.log('Seeding database with sample data...');

      // Seed Employees with hashed passwords
      const employees = sampleEmployees.map(emp => ({
        ...emp,
        password: hashPassword('default123')
      }));
      await Employee.insertMany(employees);

      // Seed Students with hashed passwords
      const students = sampleStudents.map(student => ({
        ...student,
        password: hashPassword('default123')
      }));
      await Student.insertMany(students);

      // Seed Blocks
      await Block.insertMany(sampleBlocks);

      // Seed Rooms
      await Room.insertMany(sampleRooms);

      // Seed Student Placements
      await StudentPlacement.insertMany(sampleStudentPlacements);

      // Seed Requests
      await Request.insertMany(sampleRequests);

      // Seed Emergencies
      await Emergency.insertMany(sampleEmergencies);

      // Seed Notifications
      await Notification.insertMany(sampleNotifications);

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

  async deleteStudent(studentId: string) {
    await this.init();
    // Also remove their placement
    await StudentPlacement.deleteOne({ student_id: studentId });
    const result = await Student.deleteOne({ student_id: studentId });
    return result.deletedCount > 0;
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
    const block = new Block(blockData);
    return await block.save();
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
    const emergency = new Emergency(emergencyData);
    return await emergency.save();
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

  private async assignStudentToRoom(student: any) {
    try {
      // Find suitable blocks
      const suitableBlocks = await Block.find({
        reserved_for: { $in: [student.gender, 'mixed'] },
        status: 'active',
        $or: [
          { disable_group: false },
          { disable_group: true, $expr: { $ne: [student.disability_status, 'none'] } }
        ]
      }).lean();

      if (suitableBlocks.length === 0) {
        return { success: false, error: 'No suitable blocks available' };
      }

      // Find available rooms in suitable blocks
      for (const block of suitableBlocks) {
        const availableRooms = await Room.find({
          block: block.block_id,
          status: 'available',
          $expr: { $lt: ['$current_occupancy', '$capacity'] }
        }).lean();

        if (availableRooms.length > 0) {
          const room = availableRooms[0];
          
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