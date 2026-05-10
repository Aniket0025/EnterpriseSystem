import mongoose from 'mongoose';

const internSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  department: { type: String, default: '' },
  university: { type: String, default: '' },
  internship_start: { type: Date },
  internship_end: { type: Date },
  mentor: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed', 'terminated'], default: 'active' },
  meeting_attendance: [{
    meeting_title: { type: String, required: true },
    meeting_date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    notes: { type: String, default: '' },
    marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    marked_at: { type: Date, default: Date.now }
  }],
  scheduled_meetings: [{
    meeting_title: { type: String, required: true },
    meeting_date: { type: Date, required: true },
    meeting_link: { type: String, default: '' },
    description: { type: String, default: '' },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Intern = mongoose.model('Intern', internSchema);
export default Intern;
