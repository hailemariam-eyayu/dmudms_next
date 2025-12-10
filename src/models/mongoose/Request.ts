import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  student_id: string;
  type: 'room_change' | 'maintenance' | 'complaint' | 'other';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_date: Date;
  resolved_date?: Date;
  resolved_by?: string;
  created_at: Date;
  updated_at: Date;
}

const RequestSchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    ref: 'Student',
    index: true
  },
  type: {
    type: String,
    enum: ['room_change', 'maintenance', 'complaint', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  resolved_date: {
    type: Date
  },
  resolved_by: {
    type: String,
    ref: 'Employee'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
RequestSchema.index({ student_id: 1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ type: 1 });
RequestSchema.index({ created_date: -1 });
RequestSchema.index({ resolved_by: 1 });

export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);