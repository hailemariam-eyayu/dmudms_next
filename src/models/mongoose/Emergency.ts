import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergency extends Document {
  student_id: string;
  type: 'medical' | 'security' | 'fire' | 'other';
  description: string;
  status: 'reported' | 'in_progress' | 'resolved';
  reported_date: Date;
  resolved_date?: Date;
  // Enhanced emergency contact info from Laravel
  father_name?: string;
  grand_father?: string;
  grand_grand_father?: string;
  phone?: string;
  region?: string;
  woreda?: string;
  kebele?: string;
  mother_name?: string;
  created_at: Date;
  updated_at: Date;
}

const EmergencySchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    ref: 'Student'
  },
  type: {
    type: String,
    enum: ['medical', 'security', 'fire', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['reported', 'in_progress', 'resolved'],
    default: 'reported'
  },
  reported_date: {
    type: Date,
    default: Date.now
  },
  resolved_date: {
    type: Date
  },
  // Enhanced emergency contact info
  father_name: {
    type: String,
    trim: true
  },
  grand_father: {
    type: String,
    trim: true
  },
  grand_grand_father: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  woreda: {
    type: String,
    trim: true
  },
  kebele: {
    type: String,
    trim: true
  },
  mother_name: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
EmergencySchema.index({ student_id: 1 });
EmergencySchema.index({ status: 1 });
EmergencySchema.index({ type: 1 });
EmergencySchema.index({ reported_date: -1 });

export default mongoose.models.Emergency || mongoose.model<IEmergency>('Emergency', EmergencySchema);