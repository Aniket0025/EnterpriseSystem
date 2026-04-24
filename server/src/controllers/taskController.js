import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'super_admin' || req.user.role === 'hr_admin';
    let query = {};
    if (!isAdmin) {
      query.assigned_to = req.user._id;
    }
    const tasks = await Task.find(query).sort({ createdAt: -1 }).populate('assigned_to', 'full_name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, priority, deadline, assigned_to } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      assigned_to: assigned_to || null,
      assigned_by: req.user._id,
      status: 'pending'
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const submitTask = async (req, res) => {
  const { id } = req.params;
  const { text_content } = req.body;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    let submissionData = null;

    if (req.file) {
      submissionData = {
        submission_type: 'file',
        content: req.file.path, // Cloudinary URL
        submitted_at: new Date()
      };
    } else if (text_content) {
      submissionData = {
        submission_type: 'text',
        content: text_content,
        submitted_at: new Date()
      };
    } else {
      return res.status(400).json({ message: 'No file or text content provided for submission' });
    }

    task.submission = submissionData;
    task.status = 'completed';
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
