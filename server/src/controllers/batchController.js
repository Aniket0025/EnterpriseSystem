import Batch from '../models/Batch.js';

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('trainer_id', 'name email user_id').sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBatch = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    let status = 'upcoming';
    if (start_date) {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // normalize time for correct date comparison
      const start = new Date(start_date);
      const end = end_date ? new Date(end_date) : null;
      if (now >= start && (!end || now <= end)) status = 'active';
      else if (end && now > end) status = 'completed';
    }

    const batch = await Batch.create({ ...req.body, status });
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
