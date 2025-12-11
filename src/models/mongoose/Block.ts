import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
  block_id: string;
  name: string;
  disable_group: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  occupied: number;
  reserved_for: 'male' | 'female' | 'mixed' | 'disabled';
  gender: 'male' | 'female';
  floors: number;
  rooms_per_floor: number;
  room_capacity: number;
  proctor_id?: string;
  location?: string;
  created_at: Date;
  updated_at: Date;
}

const BlockSchema: Schema = new Schema({
  block_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  disable_group: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  occupied: {
    type: Number,
    default: 0,
    min: 0
  },
  reserved_for: {
    type: String,
    enum: ['male', 'female', 'mixed', 'disabled'],
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  floors: {
    type: Number,
    required: true,
    min: 1
  },
  rooms_per_floor: {
    type: Number,
    required: true,
    min: 1
  },
  room_capacity: {
    type: Number,
    required: true,
    min: 1,
    default: 6
  },
  proctor_id: {
    type: String,
    ref: 'Employee'
  },
  location: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Additional indexes (unique indexes are automatically created)
BlockSchema.index({ status: 1 });
BlockSchema.index({ reserved_for: 1 });

export default mongoose.models.Block || mongoose.model<IBlock>('Block', BlockSchema);