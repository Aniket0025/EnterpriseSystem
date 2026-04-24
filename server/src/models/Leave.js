import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leave_type: { type: String, enum: ['casual', 'sick', 'emergency', 'annual'], required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
