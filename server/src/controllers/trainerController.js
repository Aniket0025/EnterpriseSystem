import Trainer from '../models/Trainer.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTrainer = async (req, res) => {
  const { name, email, phone, specialization, experience_years, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered as User' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name: name,
      role: 'trainer'
    });

    const trainer = await Trainer.create({
      name, email, phone, specialization, experience_years, user_id: newUser._id
    });

    res.status(201).json(trainer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
