import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'directorate' | 'coordinator' | 'proctor' | 'registrar' | 'maintainer';
  status: 'active' | 'inactive';
  password?: string;
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
  role: {
    type: String,
    enum: ['admin', 'directorate', 'coordinator', 'proctor', 'registrar', 'maintainer'],
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
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Additional indexes (unique indexes are automatically created)
EmployeeSchema.index({ role: 1 });
EmployeeSchema.index({ status: 1 });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);