import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount, generateUserNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, async (req, res) => {
  // Generate fresh notifications before returning them
  await generateUserNotifications(req.user._id, req.user.role);
  const notifications = await (await import('../models/Notification.js')).default.find({ user_id: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
});

router.route('/unread-count').get(protect, getUnreadCount);
router.route('/:id/read').put(protect, markAsRead);
router.route('/mark-all-read').put(protect, markAllAsRead);
router.route('/:id').delete(protect, deleteNotification);

export default router;
