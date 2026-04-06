import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: false },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  max_students: { type: Number, default: 30 },
  status: { type: String, enum: ['active', 'completed', 'upcoming'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Batch', batchSchema);
