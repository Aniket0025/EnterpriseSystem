import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['task', 'leave', 'interview', 'report', 'payroll', 'system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  action_url: { type: String },
  related_id: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
