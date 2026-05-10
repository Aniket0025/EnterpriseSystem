import Student from '../models/Student.js';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';

// Get all students (with user info)
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user_id', 'full_name email role')
      .sort({ createdAt: -1 });

    const result = students
      .filter(s => s.user_id)
      .map(s => ({
        _id: s._id,
        user_id: s.user_id._id,
        full_name: s.user_id.full_name,
        email: s.user_id.email,
        phone: s.phone,
        address: s.address,
        credits: s.credits,
        status: s.status,
        createdAt: s.createdAt
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single student
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user_id', 'full_name email role');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({
      _id: student._id,
      user_id: student.user_id._id,
      full_name: student.user_id.full_name,
      email: student.user_id.email,
      phone: student.phone,
      address: student.address,
      credits: student.credits,
      credit_history: student.credit_history,
      status: student.status,
      createdAt: student.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create student (creates User + Student)
export const createStudent = async (req, res) => {
  try {
    const { full_name, email, password, phone, address, credits, status } = req.body;

    // Check if user email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Create user account
    const hashedPassword = await bcryptjs.hash(password || 'student123', 10);
    const user = await User.create({ email, password: hashedPassword, full_name, role: 'student' });

    // Create student profile
    const student = await Student.create({
      user_id: user._id,
      phone: phone || '',
      address: address || '',
      credits: credits || 0,
      status: status || 'active'
    });

    // If initial credits, add to history
    if (credits && credits > 0) {
      student.credit_history.push({ amount: credits, type: 'add', reason: 'Initial credits' });
      await student.save();
    }

    await student.populate('user_id', 'full_name email role');
    res.status(201).json({
      _id: student._id,
      user_id: student.user_id._id,
      full_name: student.user_id.full_name,
      email: student.user_id.email,
      phone: student.phone,
      address: student.address,
      credits: student.credits,
      status: student.status
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { full_name, email, phone, address, status } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Update user info
    const userUpdate = {};
    if (full_name) userUpdate.full_name = full_name;
    if (email) userUpdate.email = email;
    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(student.user_id, userUpdate);
    }

    // Update student info
    if (phone !== undefined) student.phone = phone;
    if (address !== undefined) student.address = address;
    if (status) student.status = status;
    await student.save();

    await student.populate('user_id', 'full_name email role');
    res.json({
      _id: student._id,
      user_id: student.user_id._id,
      full_name: student.user_id.full_name,
      email: student.user_id.email,
      phone: student.phone,
      address: student.address,
      credits: student.credits,
      status: student.status
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete student (and user account)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await User.findByIdAndDelete(student.user_id);
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add/Deduct credits
export const manageCredits = async (req, res) => {
  try {
    const { amount, type, reason } = req.body; // type: 'add' or 'deduct'
    if (!amount || !type) return res.status(400).json({ message: 'Amount and type are required' });

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (type === 'add') {
      student.credits += amount;
    } else if (type === 'deduct') {
      if (student.credits < amount) return res.status(400).json({ message: 'Insufficient credits' });
      student.credits -= amount;
    } else {
      return res.status(400).json({ message: 'Invalid type. Use "add" or "deduct"' });
    }

    student.credit_history.push({ amount, type, reason: reason || '', date: new Date() });
    await student.save();

    res.json({
      _id: student._id,
      credits: student.credits,
      credit_history: student.credit_history
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get credit history for a student
export const getCreditHistory = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ credits: student.credits, history: student.credit_history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get student's own profile (for student role)
export const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user._id }).populate('user_id', 'full_name email role');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json({
      _id: student._id,
      full_name: student.user_id.full_name,
      email: student.user_id.email,
      phone: student.phone,
      address: student.address,
      credits: student.credits,
      credit_history: student.credit_history,
      status: student.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
