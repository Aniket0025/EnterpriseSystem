// employeeRoutes.js
import express from 'express';
export const employeeRoutes = express.Router();
import { getEmployees, createEmployee, updateEmployee } from '../controllers/employeeController.js';
employeeRoutes.route('/').get(getEmployees).post(createEmployee);
employeeRoutes.route('/:id').put(updateEmployee);

// trainerRoutes.js
export const trainerRoutes = express.Router();
import { getTrainers, createTrainer } from '../controllers/trainerController.js';
trainerRoutes.route('/').get(getTrainers).post(createTrainer);

// batchRoutes.js
export const batchRoutes = express.Router();
import { getBatches, createBatch } from '../controllers/batchController.js';
batchRoutes.route('/').get(getBatches).post(createBatch);

// payrollRoutes.js
export const payrollRoutes = express.Router();
import { getPayroll, generatePayroll, updatePayrollStatus, updatePayroll } from '../controllers/payrollController.js';
payrollRoutes.route('/').get(getPayroll);
payrollRoutes.route('/generate').post(generatePayroll);
payrollRoutes.route('/:id/status').put(updatePayrollStatus);
payrollRoutes.route('/:id').put(updatePayroll);
// taskRoutes.js
export const taskRoutes = express.Router();
import { getTasks, createTask, updateTaskStatus, submitTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('file');
  uploadSingle(req, res, function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "Upload error", error: err.message || err });
    }
    next();
  });
};

taskRoutes.route('/').get(protect, getTasks).post(protect, createTask);
taskRoutes.route('/:id/status').put(protect, updateTaskStatus);
taskRoutes.route('/:id/submit').post(protect, uploadMiddleware, submitTask);

// leaveRoutes.js
export const leaveRoutes = express.Router();
import { getLeaves, applyLeave, updateLeaveStatus } from '../controllers/leaveController.js';
leaveRoutes.route('/').get(protect, getLeaves).post(protect, applyLeave);
leaveRoutes.route('/:id/status').put(protect, updateLeaveStatus);

// dailyReportRoutes.js
export const dailyReportRoutes = express.Router();
import { getReports, submitReport, updateReportStatus } from '../controllers/dailyReportController.js';
dailyReportRoutes.route('/').get(protect, getReports).post(protect, uploadMiddleware, submitReport);
dailyReportRoutes.route('/:id/status').put(protect, updateReportStatus);

// dashboardRoutes.js
export const dashboardRoutes = express.Router();
import { getDashboardStats } from '../controllers/dashboardController.js';
dashboardRoutes.route('/stats').get(protect, getDashboardStats);
