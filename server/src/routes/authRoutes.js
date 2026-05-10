import express from 'express';
import { registerUser, loginUser, getMe, updateProfile, changePassword, superAdminSignup, updateUserRole } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/super-admin-signup', superAdminSignup);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/update-role', protect, updateUserRole);

export default router;
