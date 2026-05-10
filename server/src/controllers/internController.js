import Intern from '../models/Intern.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getInterns = async (req, res) => {
  try {
    const interns = await Intern.find().populate('user_id', 'full_name email role');
    const result = interns.map(i => ({
      _id: i._id,
      user_id: i.user_id?._id,
      full_name: i.user_id?.full_name || '',
      email: i.user_id?.email || '',
      phone: i.phone,
      address: i.address,
      department: i.department,
      university: i.university,
      internship_start: i.internship_start,
      internship_end: i.internship_end,
      mentor: i.mentor,
      status: i.status,
      totalMeetings: i.meeting_attendance.length,
      presentMeetings: i.meeting_attendance.filter(m => m.status === 'present').length,
      createdAt: i.createdAt
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getIntern = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).populate('user_id', 'full_name email role');
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    res.json(intern);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createIntern = async (req, res) => {
  try {
    const { full_name, email, password, phone, address, department, university, internship_start, internship_end, mentor } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password || 'intern123', 10);
    const user = await User.create({ full_name, email, password: hashedPassword, role: 'intern' });
    
    const intern = await Intern.create({
      user_id: user._id, phone, address, department, university,
      internship_start, internship_end, mentor
    });
    
    res.status(201).json(intern);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateIntern = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    
    const { full_name, email, phone, address, department, university, internship_start, internship_end, mentor, status } = req.body;
    
    if (full_name || email) {
      const updateData = {};
      if (full_name) updateData.full_name = full_name;
      if (email) updateData.email = email;
      await User.findByIdAndUpdate(intern.user_id, updateData);
    }
    
    const updated = await Intern.findByIdAndUpdate(req.params.id, {
      phone, address, department, university, internship_start, internship_end, mentor, status
    }, { new: true });
    
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteIntern = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    
    await User.findByIdAndDelete(intern.user_id);
    await Intern.findByIdAndDelete(req.params.id);
    res.json({ message: 'Intern deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markMeetingAttendance = async (req, res) => {
  try {
    const { internId } = req.params;
    const { meeting_title, meeting_date, status, notes } = req.body;
    
    const intern = await Intern.findById(internId);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    
    intern.meeting_attendance.push({
      meeting_title, meeting_date, status: status || 'present', notes,
      marked_by: req.user._id
    });
    
    await intern.save();
    res.json(intern);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const bulkMarkMeetingAttendance = async (req, res) => {
  try {
    const { meeting_title, meeting_date, records } = req.body;
    // records: [{ internId, status, notes }]
    
    const results = [];
    for (const r of records) {
      const intern = await Intern.findById(r.internId);
      if (!intern) continue;
      
      intern.meeting_attendance.push({
        meeting_title, meeting_date, status: r.status || 'present',
        notes: r.notes || '', marked_by: req.user._id
      });
      await intern.save();
      results.push(intern._id);
    }
    
    res.json({ message: `Attendance marked for ${results.length} interns`, count: results.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getMeetingAttendance = async (req, res) => {
  try {
    const { internId } = req.params;
    const intern = await Intern.findById(internId);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    res.json(intern.meeting_attendance);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getMyInternProfile = async (req, res) => {
  try {
    const intern = await Intern.findOne({ user_id: req.user._id }).populate('user_id', 'full_name email');
    if (!intern) return res.status(404).json({ message: 'Intern profile not found' });
    
    const totalMeetings = intern.meeting_attendance.length;
    const presentMeetings = intern.meeting_attendance.filter(m => m.status === 'present').length;
    const lateMeetings = intern.meeting_attendance.filter(m => m.status === 'late').length;
    const absentMeetings = intern.meeting_attendance.filter(m => m.status === 'absent').length;
    
    res.json({
      _id: intern._id,
      full_name: intern.user_id?.full_name,
      email: intern.user_id?.email,
      phone: intern.phone,
      department: intern.department,
      university: intern.university,
      internship_start: intern.internship_start,
      internship_end: intern.internship_end,
      mentor: intern.mentor,
      status: intern.status,
      totalMeetings, presentMeetings, lateMeetings, absentMeetings,
      attendancePct: totalMeetings > 0 ? Math.round(((presentMeetings + lateMeetings) / totalMeetings) * 100) : 0,
      meeting_attendance: intern.meeting_attendance
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
