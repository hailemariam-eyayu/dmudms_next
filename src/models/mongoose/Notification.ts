import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target_audience: 'all' | 'students' | 'staff' | 'proctors';
  created_date: Date;
  expires_date?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const NotificationSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info'
  },
  target_audience: {
    type: String,
    enum: ['all', 'students', 'staff', 'proctors'],
    default: 'all'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  expires_date: {
    type: Date
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
NotificationSchema.index({ is_active: 1 });
NotificationSchema.index({ target_audience: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ created_date: -1 });
NotificationSchema.index({ expires_date: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);