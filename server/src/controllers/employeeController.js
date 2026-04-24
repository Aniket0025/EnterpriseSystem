import Employee from '../models/Employee.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  const { name, email, phone, department, role, salary, password } = req.body;
  try {
    // 1. Create User account so they can log in
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name: name,
      role: 'employee' // default system role for employees
    });

    // 2. Create Employee profile
    const employee = await Employee.create({
      name, email, phone, department, role, salary, user_id: newUser._id
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, phone, department, role, salary, status } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      { name, phone, department, role, salary, status },
      { new: true }
    );
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
