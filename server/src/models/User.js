import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["super_admin", "hr_admin", "employee", "trainer", "student", "intern"],
    default: "employee"
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
