import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { email, password, full_name, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ email, password: hashedPassword, full_name, role: role || 'employee' });
    
    if (user) {
      res.status(201).json({
        _id: user._id, email: user.email, full_name: user.full_name, role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id, email: user.email, full_name: user.full_name, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { full_name, email } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    if (full_name) user.full_name = full_name;

    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    if (new_password.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const superAdminSignup = async (req, res) => {
  const { email, password, full_name, admin_key } = req.body;
  
  try {
    // Verify admin key (you can set this as an environment variable)
    const SUPER_ADMIN_KEY = process.env.SUPER_ADMIN_KEY || 'hrportal-super-admin-2024';
    
    console.log('Super admin signup attempt:', { email, admin_key: admin_key ? 'provided' : 'missing' });
    
    if (!admin_key || admin_key !== SUPER_ADMIN_KEY) {
      console.log('Invalid admin key provided');
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      return res.status(400).json({ message: 'Super admin already exists' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create super admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Creating super admin...');
    const superAdmin = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: 'super_admin',
      status: 'active'
    });

    console.log('Super admin created successfully!');
    res.status(201).json({
      message: 'Super admin created successfully',
      user: {
        _id: superAdmin._id,
        full_name: superAdmin.full_name,
        email: superAdmin.email,
        role: superAdmin.role,
        token: generateToken(superAdmin._id)
      }
    });
  } catch (error) {
    console.error('Super admin signup error:', error);
    res.status(500).json({ message: error.message });
  }
};
