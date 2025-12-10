import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  student_id: string;
  type: 'replacement' | 'maintenance' | 'complaint' | 'other';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'done';
  created_date: Date;
  resolved_date?: Date;
  resolved_by?: string;
  approved_by?: string;
  approved_date?: Date;
  image_path?: string;
  created_at: Date;
  updated_at: Date;
}

const RequestSchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    ref: 'Student'
  },
  type: {
    type: String,
    enum: ['replacement', 'maintenance', 'complaint', 'other'],
    required: true,
    default: 'maintenance'
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 400
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'done'],
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
  },
  approved_by: {
    type: String,
    ref: 'Employee'
  },
  approved_date: {
    type: Date
  },
  image_path: {
    type: String,
    trim: true
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