import BatchStudent from '../models/BatchStudent.js';
import StudentAttendance from '../models/StudentAttendance.js';
import Batch from '../models/Batch.js';
import User from '../models/User.js';
import Trainer from '../models/Trainer.js';

// Get students in a batch
export const getBatchStudents = async (req, res) => {
  try {
    const { batchId } = req.params;
    const enrollments = await BatchStudent.find({ batch_id: batchId, status: 'active' })
      .populate('student_id', 'full_name email role')
      .populate('added_by', 'full_name');
    
    const students = enrollments.map(e => ({
      _id: e._id,
      student_id: e.student_id._id,
      full_name: e.student_id.full_name,
      email: e.student_id.email,
      added_by: e.added_by?.full_name,
      enrolled_at: e.createdAt,
      status: e.status
    }));

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a student to a batch (HR or Trainer)
export const addStudentToBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { student_id } = req.body;
    const added_by = req.user._id;

    // Check batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    // Check student exists
    const student = await User.findById(student_id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if already enrolled
    const existing = await BatchStudent.findOne({ batch_id: batchId, student_id, status: 'active' });
    if (existing) return res.status(400).json({ message: 'Student already enrolled in this batch' });

    // Check max students
    const currentCount = await BatchStudent.countDocuments({ batch_id: batchId, status: 'active' });
    if (currentCount >= batch.max_students) return res.status(400).json({ message: 'Batch is full' });

    const enrollment = await BatchStudent.create({ batch_id: batchId, student_id, added_by, status: 'active' });
    await enrollment.populate('student_id', 'full_name email');

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Remove a student from a batch
export const removeStudentFromBatch = async (req, res) => {
  try {
    const { batchId, studentId } = req.params;
    const enrollment = await BatchStudent.findOneAndUpdate(
      { batch_id: batchId, student_id: studentId, status: 'active' },
      { status: 'dropped' },
      { new: true }
    );
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    res.json({ message: 'Student removed from batch' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Save/Update attendance for a batch on a specific date
export const saveAttendance = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { date, records } = req.body; // records: [{ student_id, status }]
    const marked_by = req.user._id;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Date and records array are required' });
    }

    // Check batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    const operations = records.map(({ student_id, status }) => ({
      updateOne: {
        filter: { batch_id: batchId, student_id, date },
        update: { $set: { status, marked_by } },
        upsert: true
      }
    }));

    await StudentAttendance.bulkWrite(operations);
    res.json({ message: 'Attendance saved successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get attendance for a batch on a specific date
export const getAttendance = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { date } = req.query;

    const filter = { batch_id: batchId };
    if (date) filter.date = date;

    const attendance = await StudentAttendance.find(filter)
      .populate('student_id', 'full_name email')
      .populate('marked_by', 'full_name')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get attendance history for a batch (grouped by date)
export const getAttendanceHistory = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { month, year } = req.query;

    let dateFilter = { batch_id: batchId };
    if (month && year) {
      const m = parseInt(month);
      const y = parseInt(year);
      const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
      const endDate = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`;
      dateFilter.date = { $gte: startDate, $lt: endDate };
    }

    const records = await StudentAttendance.find(dateFilter)
      .populate('student_id', 'full_name email')
      .sort({ date: -1, createdAt: 1 });

    // Group by date
    const grouped = {};
    records.forEach(r => {
      if (!grouped[r.date]) grouped[r.date] = [];
      grouped[r.date].push({
        _id: r._id,
        student_id: r.student_id._id,
        full_name: r.student_id.full_name,
        email: r.student_id.email,
        status: r.status,
        marked_by: r.marked_by?.full_name
      });
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get student's own attendance across batches
export const getMyAttendance = async (req, res) => {
  try {
    const student_id = req.user._id;
    const { batch_id } = req.query;

    const filter = { student_id };
    if (batch_id) filter.batch_id = batch_id;

    const records = await StudentAttendance.find(filter)
      .populate('batch_id', 'name course')
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get batches for a trainer (assigned to them)
export const getTrainerBatches = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user_id: req.user._id });
    if (!trainer) return res.json([]);

    const batches = await Batch.find({ trainer_id: trainer._id, status: 'active' });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students (for adding to batch - HR/Trainer can search)
export const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { role: 'student' };
    if (q) {
      filter.$or = [
        { full_name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    const students = await User.find(filter).select('full_name email role').limit(20);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
