import mongoose from 'mongoose';

const studentAttendanceSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Ensure one attendance record per student per batch per date
studentAttendanceSchema.index({ batch_id: 1, student_id: 1, date: 1 }, { unique: true });

const StudentAttendance = mongoose.model('StudentAttendance', studentAttendanceSchema);
export default StudentAttendance;
