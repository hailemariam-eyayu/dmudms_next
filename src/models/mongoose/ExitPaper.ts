import mongoose, { Schema, Document } from 'mongoose';

export interface IExitPaper extends Document {
  stud_id: string;
  request_date: Date;
  type: string;
  status: 'pending' | 'printed';
  color: string;
  number: number;
  approved_date?: Date;
  created_at: Date;
  updated_at: Date;
}

const ExitPaperSchema: Schema = new Schema({
  stud_id: {
    type: String,
    required: true,
    ref: 'Student'
  },
  request_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['pending', 'printed'],
    default: 'pending'
  },
  color: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true,
    min: 1
  },
  approved_date: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
ExitPaperSchema.index({ stud_id: 1 });
ExitPaperSchema.index({ status: 1 });
ExitPaperSchema.index({ request_date: -1 });

export default mongoose.models.ExitPaper || mongoose.model<IExitPaper>('ExitPaper', ExitPaperSchema);