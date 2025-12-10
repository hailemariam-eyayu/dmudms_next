import mongoose, { Schema, Document } from 'mongoose';

export interface IProctorPlacement extends Document {
  proctor_id: string;
  year: string;
  first_entry: Date;
  block: string;
  created_at: Date;
  updated_at: Date;
}

const ProctorPlacementSchema: Schema = new Schema({
  proctor_id: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  year: {
    type: String,
    required: true
  },
  first_entry: {
    type: Date,
    required: true,
    default: Date.now
  },
  block: {
    type: String,
    required: true,
    ref: 'Block'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
ProctorPlacementSchema.index({ proctor_id: 1, block: 1 }, { unique: true });
ProctorPlacementSchema.index({ block: 1 });
ProctorPlacementSchema.index({ year: 1 });

export default mongoose.models.ProctorPlacement || mongoose.model<IProctorPlacement>('ProctorPlacement', ProctorPlacementSchema);