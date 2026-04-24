import mongoose from 'mongoose';

const dailyReportSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  report_date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  hours_worked: { type: Number, required: true },
  attachment: { type: String }, // Cloudinary URL
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
}, { timestamps: true });

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);
export default DailyReport;
