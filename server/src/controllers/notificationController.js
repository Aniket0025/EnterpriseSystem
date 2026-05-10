import Notification from '../models/Notification.js';
import Task from '../models/Task.js';
import Leave from '../models/Leave.js';
import Interview from '../models/Interview.js';
import DailyReport from '../models/DailyReport.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user_id: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper: Generate notifications for a user based on recent activity
export const generateUserNotifications = async (userId, userRole) => {
  try {
    const existing = await Notification.find({ user_id: userId }).sort({ createdAt: -1 }).limit(1);
    const lastCheck = existing.length > 0 ? existing[0].createdAt : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const newNotifications = [];

    // Task-related notifications
    const tasks = await Task.find({
      assigned_to: userId,
      $or: [
        { status: 'pending', deadline: { $lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) } },
        { createdAt: { $gte: lastCheck } }
      ]
    }).limit(5);

    for (const task of tasks) {
      const alreadyExists = await Notification.findOne({
        user_id: userId,
        related_id: task._id,
        type: 'task'
      });
      if (!alreadyExists) {
        if (task.status === 'pending' && task.deadline) {
          const daysLeft = Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 2 && daysLeft >= 0) {
            newNotifications.push({
              user_id: userId,
              type: 'task',
              title: 'Task deadline approaching',
              message: `"${task.title}" is due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
              read: false,
              action_url: '/tasks',
              related_id: task._id
            });
          }
        }
        if (task.createdAt >= lastCheck) {
          newNotifications.push({
            user_id: userId,
            type: 'task',
            title: 'New task assigned',
            message: `You've been assigned: "${task.title}"`,
            read: false,
            action_url: '/tasks',
            related_id: task._id
          });
        }
      }
    }

    // Leave-related notifications
    const leaves = await Leave.find({
      $or: [
        { user_id: userId },
        ...(userRole === 'super_admin' || userRole === 'hr_admin' ? [{ status: 'pending' }] : [])
      ],
      updatedAt: { $gte: lastCheck }
    }).limit(5);

    for (const leave of leaves) {
      const alreadyExists = await Notification.findOne({
        user_id: userId,
        related_id: leave._id,
        type: 'leave'
      });
      if (!alreadyExists) {
        if (leave.user_id.toString() === userId.toString()) {
          if (leave.status === 'approved') {
            newNotifications.push({
              user_id: userId,
              type: 'leave',
              title: 'Leave request approved',
              message: `Your ${leave.leave_type} leave from ${new Date(leave.start_date).toLocaleDateString()} to ${new Date(leave.end_date).toLocaleDateString()} has been approved`,
              read: false,
              action_url: '/leave',
              related_id: leave._id
            });
          } else if (leave.status === 'rejected') {
            newNotifications.push({
              user_id: userId,
              type: 'leave',
              title: 'Leave request rejected',
              message: `Your ${leave.leave_type} leave from ${new Date(leave.start_date).toLocaleDateString()} to ${new Date(leave.end_date).toLocaleDateString()} has been rejected`,
              read: false,
              action_url: '/leave',
              related_id: leave._id
            });
          }
        }
        if (userRole === 'super_admin' || userRole === 'hr_admin') {
          if (leave.status === 'pending' && leave.user_id.toString() !== userId.toString()) {
            newNotifications.push({
              user_id: userId,
              type: 'leave',
              title: 'New leave request',
              message: `A ${leave.leave_type} leave request has been submitted and needs approval`,
              read: false,
              action_url: '/leave',
              related_id: leave._id
            });
          }
        }
      }
    }

    // Interview reminders (for HR)
    if (userRole === 'super_admin' || userRole === 'hr_admin') {
      const interviews = await Interview.find({
        date: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        }
      }).limit(5);

      for (const interview of interviews) {
        const alreadyExists = await Notification.findOne({
          user_id: userId,
          related_id: interview._id,
          type: 'interview'
        });
        if (!alreadyExists) {
          newNotifications.push({
            user_id: userId,
            type: 'interview',
            title: 'Interview reminder',
            message: `Interview scheduled on ${new Date(interview.date).toLocaleDateString()} at ${interview.time || 'N/A'}`,
            read: false,
            action_url: '/interviews',
            related_id: interview._id
          });
        }
      }
    }

    // Daily report reminder
    const today = new Date().toISOString().slice(0, 10);
    const todayReport = await DailyReport.findOne({
      user_id: userId,
      date: today
    });
    if (!todayReport) {
      const alreadyExists = await Notification.findOne({
        user_id: userId,
        type: 'report',
        title: 'Daily report pending',
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      if (!alreadyExists) {
        newNotifications.push({
          user_id: userId,
          type: 'report',
          title: 'Daily report pending',
          message: "You haven't submitted your daily report for today",
          read: false,
          action_url: '/daily-reports'
        });
      }
    }

    if (newNotifications.length > 0) {
      await Notification.insertMany(newNotifications);
    }

    return newNotifications.length;
  } catch (err) {
    console.error('Error generating notifications:', err);
    return 0;
  }
};
