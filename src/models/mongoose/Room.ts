import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  room_id: string;
  block: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  capacity: number;
  current_occupancy: number;
  created_at: Date;
  updated_at: Date;
}

const RoomSchema: Schema = new Schema({
  room_id: {
    type: String,
    required: true,
    index: true
  },
  block: {
    type: String,
    required: true,
    ref: 'Block',
    index: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  current_occupancy: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound index for room_id + block (unique combination)
RoomSchema.index({ room_id: 1, block: 1 }, { unique: true });
RoomSchema.index({ block: 1 });
RoomSchema.index({ status: 1 });

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);