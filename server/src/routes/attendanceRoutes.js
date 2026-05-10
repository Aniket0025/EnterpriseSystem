import express from 'express';
import {
  getBatchStudents,
  addStudentToBatch,
  removeStudentFromBatch,
  saveAttendance,
  getAttendance,
  getAttendanceHistory,
  getMyAttendance,
  getTrainerBatches,
  searchStudents
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Trainer batches
router.route('/trainer-batches').get(protect, getTrainerBatches);

// Student search (for adding to batch)
router.route('/students/search').get(protect, searchStudents);

// Student's own attendance
router.route('/my-attendance').get(protect, getMyAttendance);

// Batch students
router.route('/batch/:batchId/students')
  .get(protect, getBatchStudents)
  .post(protect, addStudentToBatch);

router.route('/batch/:batchId/students/:studentId')
  .delete(protect, removeStudentFromBatch);

// Batch attendance
router.route('/batch/:batchId/attendance')
  .get(protect, getAttendance)
  .post(protect, saveAttendance);

// Batch attendance history
router.route('/batch/:batchId/attendance/history')
  .get(protect, getAttendanceHistory);

export default router;
