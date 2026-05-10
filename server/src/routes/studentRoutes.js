import express from 'express';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  manageCredits,
  getCreditHistory,
  getMyProfile
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student's own profile (for student role)
router.route('/me').get(protect, getMyProfile);

// Credit management
router.route('/:id/credits')
  .post(protect, manageCredits)
  .get(protect, getCreditHistory);

// CRUD
router.route('/')
  .get(protect, getStudents)
  .post(protect, createStudent);

router.route('/:id')
  .get(protect, getStudent)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);

export default router;
