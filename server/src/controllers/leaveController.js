import Leave from '../models/Leave.js';
import User from '../models/User.js';

export const getLeaves = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'super_admin' || req.user.role === 'hr_admin';
    let query = {};
    if (!isAdmin) {
      query.user_id = req.user._id;
    }
    const leaves = await Leave.find(query).sort({ createdAt: -1 }).populate('user_id', 'full_name email role');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyLeave = async (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;
  try {
    const leave = await Leave.create({
      user_id: req.user._id,
      leave_type,
      start_date,
      end_date,
      reason,
      status: 'pending'
    });
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
