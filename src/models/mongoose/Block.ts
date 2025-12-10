import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
  block_id: string;
  disable_group: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  reserved_for: 'male' | 'female' | 'mixed' | 'disabled';
  created_at: Date;
  updated_at: Date;
}

const BlockSchema: Schema = new Schema({
  block_id: {
    type: String,
    required: true,
    unique: true
  },
  disable_group: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  reserved_for: {
    type: String,
    enum: ['male', 'female', 'mixed', 'disabled'],
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Additional indexes (unique indexes are automatically created)
BlockSchema.index({ status: 1 });
BlockSchema.index({ reserved_for: 1 });

export default mongoose.models.Block || mongoose.model<IBlock>('Block', BlockSchema);