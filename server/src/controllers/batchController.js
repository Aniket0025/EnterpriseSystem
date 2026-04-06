import Batch from '../models/Batch.js';

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('trainer_id', 'name email').sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
