import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  student_id: string;
  first_name: string;
  second_name?: string;
  last_name: string;
  email: string;
  gender: 'male' | 'female';
  batch: string;
  disability_status: 'none' | 'physical' | 'visual' | 'hearing' | 'other';
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  password?: string;
  created_at: Date;
  updated_at: Date;
}

const StudentSchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  second_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  disability_status: {
    type: String,
    enum: ['none', 'physical', 'visual', 'hearing', 'other'],
    default: 'none'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'suspended'],
    default: 'active'
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Additional indexes (unique indexes are automatically created)
StudentSchema.index({ status: 1 });
StudentSchema.index({ batch: 1 });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);