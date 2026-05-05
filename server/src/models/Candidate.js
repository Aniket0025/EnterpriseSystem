import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  candidate_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null,
  },
  position: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected'],
    default: 'applied',
  },
  notes: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Candidate', candidateSchema);
