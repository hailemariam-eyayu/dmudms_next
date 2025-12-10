import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  block: string;
  room: string;
  unlocker: 'Original' | 'Copy';
  locker: number;
  chair: number;
  pure_foam: number;
  damaged_foam: number;
  tiras: number;
  tables: number;
  chibud: number;
  created_at: Date;
  updated_at: Date;
}

const MaterialSchema: Schema = new Schema({
  block: {
    type: String,
    required: true,
    ref: 'Block'
  },
  room: {
    type: String,
    required: true
  },
  unlocker: {
    type: String,
    enum: ['Original', 'Copy'],
    required: true
  },
  locker: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  chair: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  pure_foam: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  damaged_foam: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  tiras: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  tables: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  chibud: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
MaterialSchema.index({ block: 1, room: 1 }, { unique: true });
MaterialSchema.index({ block: 1 });

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);