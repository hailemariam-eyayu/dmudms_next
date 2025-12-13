import mongoose, { Schema, Document } from 'mongoose';

export interface IExitPaperItem {
  type_of_cloth: string;
  number_of_items: number;
  color: string;
}

export interface IExitPaper extends Document {
  student_id: string;
  student_name: string;
  items: IExitPaperItem[];
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string; // proctor employee_id
  approved_by_name?: string;
  approved_at?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

const ExitPaperItemSchema: Schema = new Schema({
  type_of_cloth: {
    type: String,
    required: true,
    trim: true
  },
  number_of_items: {
    type: Number,
    required: true,
    min: 1
  },
  color: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const ExitPaperSchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    trim: true
  },
  student_name: {
    type: String,
    required: true,
    trim: true
  },
  items: {
    type: [ExitPaperItemSchema],
    required: true,
    validate: {
      validator: function(items: IExitPaperItem[]) {
        return items && items.length > 0;
      },
      message: 'At least one item is required'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approved_by: {
    type: String,
    trim: true
  },
  approved_by_name: {
    type: String,
    trim: true
  },
  approved_at: {
    type: Date
  },
  rejection_reason: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
ExitPaperSchema.index({ student_id: 1 });
ExitPaperSchema.index({ status: 1 });
ExitPaperSchema.index({ approved_by: 1 });
ExitPaperSchema.index({ created_at: -1 });

export default mongoose.models.ExitPaper || mongoose.model<IExitPaper>('ExitPaper', ExitPaperSchema);