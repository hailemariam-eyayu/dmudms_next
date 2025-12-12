import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: 'male' | 'female';
  phone?: string;
  department?: string;
  role: 'admin' | 'directorate' | 'coordinator' | 'proctor' | 'proctor_manager' | 'registrar' | 'maintainer';
  status: 'active' | 'inactive';
  password?: string;
  profile_image?: string;
  profile_image_public_id?: string;
  created_at: Date;
  updated_at: Date;
}

const EmployeeSchema: Schema = new Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true,
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
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'directorate', 'coordinator', 'proctor', 'proctor_manager', 'registrar', 'maintainer'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  password: {
    type: String,
    select: false
  },
  profile_image: {
    type: String,
    trim: true
  },
  profile_image_public_id: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Additional indexes (unique indexes are automatically created)
EmployeeSchema.index({ role: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ gender: 1 });
EmployeeSchema.index({ role: 1, gender: 1 });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);