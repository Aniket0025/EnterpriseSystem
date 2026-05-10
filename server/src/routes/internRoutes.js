import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getInterns, getIntern, createIntern, updateIntern, deleteIntern, markMeetingAttendance, bulkMarkMeetingAttendance, getMeetingAttendance, getMyInternProfile } from '../controllers/internController.js';

const router = express.Router();

router.get('/', protect, getInterns);
router.get('/me', protect, getMyInternProfile);
router.get('/:id', protect, getIntern);
router.post('/', protect, createIntern);
router.put('/:id', protect, updateIntern);
router.delete('/:id', protect, deleteIntern);
router.post('/:internId/meeting-attendance', protect, markMeetingAttendance);
router.post('/meeting-attendance/bulk', protect, bulkMarkMeetingAttendance);
router.get('/:internId/meeting-attendance', protect, getMeetingAttendance);

export default router;
