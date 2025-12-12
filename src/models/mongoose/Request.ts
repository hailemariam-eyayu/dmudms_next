import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  student_id: string;
  type: 'maintenance' | 'replacement' | 'room_change' | 'complaint' | 'other';
  category: 'plumbing' | 'electrical' | 'furniture' | 'cleaning' | 'hvac' | 'room_assignment' | 'block_transfer' | 'roommate_change' | 'noise_complaint' | 'safety_issue' | 'general_inquiry';
  priority: 'low' | 'medium' | 'high' | 'urgent';
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
    enum: ['maintenance', 'replacement', 'room_change', 'complaint', 'other'],
    required: true,
    default: 'maintenance'
  },
  category: {
    type: String,
    enum: [
      // Maintenance categories
      'plumbing', 'electrical', 'furniture', 'cleaning', 'hvac',
      // Replacement categories  
      'room_assignment', 'block_transfer', 'roommate_change',
      // Other categories
      'noise_complaint', 'safety_issue', 'general_inquiry'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
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