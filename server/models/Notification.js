import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  targetRole: {
    type: String,
    enum: ['admin', 'manager'],
    required: true
  },
  type: {
    type: String,
    default: 'stock_adjustment'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  adjustedBy: {
    name: { type: String, required: true },
    role: { type: String, required: true }
  },
  productName: {
    type: String,
    required: true
  },
  adjustment: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
