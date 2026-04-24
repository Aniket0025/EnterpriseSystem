import DailyReport from '../models/DailyReport.js';

export const getReports = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'super_admin' || req.user.role === 'hr_admin';
    let query = {};
    if (!isAdmin) {
      query.user_id = req.user._id;
    }
    const reports = await DailyReport.find(query).sort({ report_date: -1 }).populate('user_id', 'full_name email role');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitReport = async (req, res) => {
  const { description, hours_worked, report_date } = req.body;
  try {
    let attachmentUrl = null;
    if (req.file) {
      attachmentUrl = req.file.path; // Cloudinary URL
    }

    const report = await DailyReport.create({
      user_id: req.user._id,
      report_date: report_date ? new Date(report_date) : new Date(),
      description,
      hours_worked: Number(hours_worked) || 8,
      attachment: attachmentUrl,
      status: 'pending'
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const report = await DailyReport.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
