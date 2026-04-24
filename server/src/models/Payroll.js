import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employee_name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., 'Employee', 'Trainer', 'Intern'
  department: { type: String, default: 'General' },
  base_salary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  net_pay: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., '2024-06'
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
