import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  recruitment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  scheduled_at: {
    type: Date,
    required: true,
  },
  meeting_link: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
