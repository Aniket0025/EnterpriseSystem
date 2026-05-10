import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';
import Payroll from '../models/Payroll.js';
import Leave from '../models/Leave.js';
import Student from '../models/Student.js';
import Batch from '../models/Batch.js';
import Trainer from '../models/Trainer.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    // ===== SUPER ADMIN / HR ADMIN =====
    if (userRole === 'super_admin' || userRole === 'hr_admin') {
      const totalEmployees = await User.countDocuments({ role: { $in: ['employee', 'intern'] } });
      const activeTasks = await Task.countDocuments({ status: { $ne: 'completed' } });
      const payrollResult = await Payroll.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$net_pay' } } }]);
      const monthlyPayroll = payrollResult.length > 0 ? payrollResult[0].total : 0;
      const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
      const totalTrainers = await User.countDocuments({ role: 'trainer' });
      const totalStudents = await Student.countDocuments({});
      const completedTasks = await Task.countDocuments({ status: 'completed' });
      const activeBatches = await Batch.countDocuments({});

      const deptAgg = await Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }, { $project: { name: { $ifNull: ['$_id', 'Unassigned'] }, value: '$count', _id: 0 } }]);
      const departmentDistribution = deptAgg.length > 0 ? deptAgg : [{ name: 'No Data', value: 1 }];

      const hiringAgg = await User.aggregate([{ $group: { _id: { month: { $month: '$createdAt' } }, hires: { $sum: 1 } } }, { $sort: { '_id.month': 1 } }]);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const hiringTrend = hiringAgg.map(item => ({ month: monthNames[item._id.month - 1] || 'Unknown', hires: item.hires, exits: 0 }));

      const performanceTrend = [
        { month: "Jan", score: completedTasks > 0 ? 60 + Math.random()*20 : 0 },
        { month: "Feb", score: completedTasks > 0 ? 65 + Math.random()*20 : 0 },
        { month: "Mar", score: completedTasks > 0 ? 70 + Math.random()*20 : 0 },
        { month: "Apr", score: completedTasks > 0 ? 75 + Math.random()*20 : 0 },
        { month: "May", score: completedTasks > 0 ? 80 + Math.random()*20 : 0 },
        { month: "Jun", score: completedTasks > 0 ? 85 + Math.random()*15 : 0 },
      ];

      const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(3).populate('assigned_to', 'full_name');
      const recentLeaves = await Leave.find().sort({ createdAt: -1 }).limit(3).populate('user_id', 'full_name');
      const recentUsers = await User.find().sort({ createdAt: -1 }).limit(2);
      let recentActivities = [];
      recentUsers.forEach(u => { recentActivities.push({ action: 'New employee onboarded', who: u.full_name || u.email, time: u.createdAt }); });
      recentLeaves.forEach(l => { recentActivities.push({ action: `Leave ${l.status}`, who: l.user_id ? (l.user_id.full_name || 'User') : 'Unknown', time: l.createdAt }); });
      recentTasks.forEach(t => { recentActivities.push({ action: `Task ${t.status}`, who: t.assigned_to ? (t.assigned_to.full_name || 'User') : 'Unknown', time: t.createdAt }); });
      recentActivities.sort((a, b) => b.time - a.time);
      recentActivities = recentActivities.slice(0, 5).map(a => ({ ...a, time: new Date(a.time).toLocaleDateString() }));

      return res.json({
        role: userRole,
        stats: { totalEmployees, activeTasks, monthlyPayroll, pendingLeaves, totalTrainers, totalStudents, completedTasks, activeBatches },
        charts: { departmentDistribution, hiringTrend: hiringTrend.length > 0 ? hiringTrend : [{ month: 'N/A', hires: 0, exits: 0 }], performanceTrend },
        recentActivities
      });
    }

    // ===== EMPLOYEE =====
    if (userRole === 'employee') {
      const myTasks = await Task.find({ assigned_to: userId }).sort({ deadline: 1 });
      const activeTasks = myTasks.filter(t => t.status !== 'completed').length;
      const completedTasks = myTasks.filter(t => t.status === 'completed').length;
      const pendingLeaves = await Leave.countDocuments({ user_id: userId, status: 'pending' });
      const approvedLeaves = await Leave.countDocuments({ user_id: userId, status: 'approved' });
      const recentTasks = myTasks.slice(0, 5).map(t => ({ title: t.title, status: t.status, priority: t.priority, deadline: t.deadline }));

      return res.json({
        role: userRole,
        stats: { activeTasks, completedTasks, pendingLeaves, approvedLeaves, totalTasks: myTasks.length },
        recentTasks
      });
    }

    // ===== TRAINER =====
    if (userRole === 'trainer') {
      const trainerProfile = await Trainer.findOne({ user_id: userId });
      const myBatches = await Batch.find({ trainer_id: trainerProfile?._id }).populate('trainer_id');
      const activeBatches = myBatches.filter(b => b.status === 'active' || new Date(b.end_date) >= new Date()).length;
      
      // Get students in trainer's batches
      const batchStudentModule = await import('../models/BatchStudent.js');
      const BatchStudent = batchStudentModule.default;
      const batchIds = myBatches.map(b => b._id);
      const totalStudents = await BatchStudent.countDocuments({ batch_id: { $in: batchIds }, status: 'active' });

      const recentBatches = myBatches.slice(0, 5).map(b => ({ name: b.name, course: b.course, startDate: b.start_date, endDate: b.end_date, timing: b.class_timing }));

      return res.json({
        role: userRole,
        stats: { totalBatches: myBatches.length, activeBatches, totalStudents, trainerName: trainerProfile?.name || '' },
        recentBatches
      });
    }

    // ===== STUDENT =====
    if (userRole === 'student') {
      const studentProfile = await Student.findOne({ user_id: userId });
      const batchStudentModule = await import('../models/BatchStudent.js');
      const BatchStudent = batchStudentModule.default;
      const studentAttendanceModule = await import('../models/StudentAttendance.js');
      const StudentAttendance = studentAttendanceModule.default;

      const myBatches = await BatchStudent.find({ student_id: studentProfile?._id, status: 'active' }).populate({
        path: 'batch_id', populate: { path: 'trainer_id' }
      });

      const totalAttendance = await StudentAttendance.countDocuments({ student_id: userId });
      const presentCount = await StudentAttendance.countDocuments({ student_id: userId, status: 'present' });
      const attendancePct = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

      const batchList = myBatches.map(bs => ({
        name: bs.batch_id?.name || '',
        course: bs.batch_id?.course || '',
        trainer: bs.batch_id?.trainer_id?.name || '',
        timing: bs.batch_id?.class_timing || ''
      }));

      return res.json({
        role: userRole,
        stats: {
          totalBatches: myBatches.length,
          credits: studentProfile?.credits || 0,
          status: studentProfile?.status || 'active',
          attendancePct,
          presentDays: presentCount,
          totalDays: totalAttendance
        },
        batches: batchList
      });
    }

    // ===== INTERN =====
    if (userRole === 'intern') {
      const internProfile = await Intern.findOne({ user_id: userId });
      const totalMeetings = internProfile?.meeting_attendance?.length || 0;
      const presentMeetings = internProfile?.meeting_attendance?.filter(m => m.status === 'present').length || 0;
      const lateMeetings = internProfile?.meeting_attendance?.filter(m => m.status === 'late').length || 0;
      const absentMeetings = internProfile?.meeting_attendance?.filter(m => m.status === 'absent').length || 0;
      const attendancePct = totalMeetings > 0 ? Math.round(((presentMeetings + lateMeetings) / totalMeetings) * 100) : 0;

      const recentMeetings = (internProfile?.meeting_attendance || []).slice(-5).reverse().map(m => ({
        title: m.meeting_title, date: m.meeting_date, status: m.status, notes: m.notes
      }));

      return res.json({
        role: userRole,
        stats: {
          totalMeetings, presentMeetings, lateMeetings, absentMeetings, attendancePct,
          status: internProfile?.status || 'active',
          department: internProfile?.department || '',
          mentor: internProfile?.mentor || '',
          university: internProfile?.university || ''
        },
        recentMeetings
      });
    }

    // Fallback
    res.json({ role: userRole, stats: {}, charts: {}, recentActivities: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
