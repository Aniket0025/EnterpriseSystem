import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  credits: { type: Number, default: 0 },
  credit_history: [{
    amount: { type: Number, required: true },
    type: { type: String, enum: ['add', 'deduct'], required: true },
    reason: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
