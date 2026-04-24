import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';
import Trainer from '../models/Trainer.js';

export const getPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generatePayroll = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., '2024-06'
    
    // Fetch all active employees (includes interns if their role/department says so)
    const employees = await Employee.find({ status: { $ne: 'Inactive' } });
    const trainers = await Trainer.find({ status: { $ne: 'inactive' } });

    let generatedCount = 0;

    // Process Employees
    for (const emp of employees) {
      const existing = await Payroll.findOne({ user_id: emp.user_id, month: currentMonth });
      if (!existing && emp.salary) {
        // Assume salary is string like "$8,000" or just "8000"
        const baseSalary = Number(String(emp.salary).replace(/[^0-9.-]+/g,"")) || 5000;
        const bonus = 0; // Default bonus
        const deductions = baseSalary * 0.1; // 10% deduction dummy logic
        const netPay = baseSalary + bonus - deductions;

        await Payroll.create({
          user_id: emp.user_id,
          employee_name: emp.name,
          role: emp.role?.toLowerCase() === 'intern' ? 'Intern' : 'Employee',
          department: emp.department || 'General',
          base_salary: baseSalary,
          bonus,
          deductions,
          net_pay: netPay,
          month: currentMonth,
          status: 'Pending'
        });
        generatedCount++;
      }
    }

    // Process Trainers
    for (const trainer of trainers) {
      const existing = await Payroll.findOne({ user_id: trainer.user_id, month: currentMonth });
      if (!existing) {
        // Trainers might not have salary field, assume 6000 base
        const baseSalary = 6000;
        const bonus = 0;
        const deductions = baseSalary * 0.1;
        const netPay = baseSalary + bonus - deductions;

        await Payroll.create({
          user_id: trainer.user_id,
          employee_name: trainer.name,
          role: 'Trainer',
          department: trainer.specialization || 'Training',
          base_salary: baseSalary,
          bonus,
          deductions,
          net_pay: netPay,
          month: currentMonth,
          status: 'Pending'
        });
        generatedCount++;
      }
    }

    res.status(201).json({ message: `Successfully generated ${generatedCount} payslips for ${currentMonth}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePayrollStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });
    res.json(payroll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePayroll = async (req, res) => {
  const { id } = req.params;
  const { base_salary, bonus, deductions, net_pay, month, status } = req.body;
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { base_salary, bonus, deductions, net_pay, month, status },
      { new: true }
    );
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });
    res.json(payroll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
