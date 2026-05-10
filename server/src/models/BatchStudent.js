import mongoose from 'mongoose';

const batchStudentSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' }
}, { timestamps: true });

// Ensure a student can only be in a batch once
batchStudentSchema.index({ batch_id: 1, student_id: 1 }, { unique: true });

const BatchStudent = mongoose.model('BatchStudent', batchStudentSchema);
export default BatchStudent;
