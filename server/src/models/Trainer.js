import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialization: { type: String },
  experience_years: { type: Number },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;
