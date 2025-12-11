import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  room_id: string;
  block: string;
  floor: number;
  room_number: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  capacity: number;
  current_occupancy: number;
  disability_accessible: boolean;
  created_at: Date;
  updated_at: Date;
}

const RoomSchema: Schema = new Schema({
  room_id: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: true,
    ref: 'Block'
  },
  floor: {
    type: Number,
    required: true,
    min: 0
  },
  room_number: {
    type: String,
    required: true
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
  },
  disability_accessible: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
RoomSchema.index({ room_id: 1 }, { unique: true });
RoomSchema.index({ block: 1, floor: 1, room_number: 1 }, { unique: true });
RoomSchema.index({ block: 1 });
RoomSchema.index({ status: 1 });
RoomSchema.index({ disability_accessible: 1 });

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);