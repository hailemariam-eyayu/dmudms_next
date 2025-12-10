import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentPlacement extends Document {
  student_id: string;
  room: string;
  block: string;
  year: string;
  status: 'active' | 'inactive' | 'transferred';
  assigned_date: Date;
  created_at: Date;
  updated_at: Date;
}

const StudentPlacementSchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    unique: true,
    ref: 'Student',
    index: true
  },
  room: {
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
  year: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'transferred'],
    default: 'active'
  },
  assigned_date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
StudentPlacementSchema.index({ student_id: 1 });
StudentPlacementSchema.index({ room: 1, block: 1 });
StudentPlacementSchema.index({ block: 1 });
StudentPlacementSchema.index({ status: 1 });
StudentPlacementSchema.index({ year: 1 });

export default mongoose.models.StudentPlacement || mongoose.model<IStudentPlacement>('StudentPlacement', StudentPlacementSchema);