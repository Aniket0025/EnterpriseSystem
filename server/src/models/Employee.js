import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  role: { type: String },
  salary: { type: String },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
