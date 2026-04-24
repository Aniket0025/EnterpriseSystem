import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  deadline: { type: Date },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submission: {
    submission_type: { type: String, enum: ['text', 'file'] },
    content: { type: String }, // either text content or cloudinary URL
    submitted_at: { type: Date }
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
