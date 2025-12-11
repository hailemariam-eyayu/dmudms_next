import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyContact extends Document {
  student_id: string;
  father_name: string;
  grand_father: string;
  grand_grand_father: string;
  mother_name: string;
  phone: string;
  region: string;
  woreda: string;
  kebele: string;
  created_at: Date;
  updated_at: Date;
}

const EmergencyContactSchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    unique: true,
    ref: 'Student'
  },
  father_name: {
    type: String,
    required: true,
    trim: true
  },
  grand_father: {
    type: String,
    required: true,
    trim: true
  },
  grand_grand_father: {
    type: String,
    required: true,
    trim: true
  },
  mother_name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^(\+251|09|07)\d{8,9}$/.test(v);
      },
      message: 'Phone must be a valid Ethiopian number (+251XXXXXXXXX, 09XXXXXXXX, or 07XXXXXXXX)'
    }
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  woreda: {
    type: String,
    required: true,
    trim: true
  },
  kebele: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
EmergencyContactSchema.index({ student_id: 1 });
EmergencyContactSchema.index({ phone: 1 });

export default mongoose.models.EmergencyContact || mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);