import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';
import Payroll from '../models/Payroll.js';
import Leave from '../models/Leave.js';

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Stats
    const totalEmployees = await User.countDocuments({ role: { $in: ['employee', 'intern'] } });
    const activeTasks = await Task.countDocuments({ status: { $ne: 'completed' } });
    
    // Calculate Monthly Payroll
    const payrollResult = await Payroll.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$net_pay' } } }
    ]);
    const monthlyPayroll = payrollResult.length > 0 ? payrollResult[0].total : 0;
    
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const completedTasks = await Task.countDocuments({ status: 'completed' }); // Used as performance proxy

    // 2. Department Distribution (Pie Chart)
    const deptAgg = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { name: { $ifNull: ['$_id', 'Unassigned'] }, value: '$count', _id: 0 } }
    ]);
    const departmentDistribution = deptAgg.length > 0 ? deptAgg : [{ name: 'No Data', value: 1 }];

    // 3. Hiring Trend (Bar Chart) - Group Users by month created
    const hiringAgg = await User.aggregate([
      { $group: {
          _id: { month: { $month: '$createdAt' } },
          hires: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const hiringTrend = hiringAgg.map(item => ({
      month: monthNames[item._id.month - 1] || 'Unknown',
      hires: item.hires,
      exits: 0 // Mock exits for now
    }));

    // 4. Performance Trend (Line Chart) - Mock data scaled to tasks
    const performanceTrend = [
      { month: "Jan", score: completedTasks > 0 ? 60 + Math.random()*20 : 0 },
      { month: "Feb", score: completedTasks > 0 ? 65 + Math.random()*20 : 0 },
      { month: "Mar", score: completedTasks > 0 ? 70 + Math.random()*20 : 0 },
      { month: "Apr", score: completedTasks > 0 ? 75 + Math.random()*20 : 0 },
      { month: "May", score: completedTasks > 0 ? 80 + Math.random()*20 : 0 },
      { month: "Jun", score: completedTasks > 0 ? 85 + Math.random()*15 : 0 },
    ];

    // 5. Recent Activities
    const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(3).populate('assigned_to', 'full_name');
    const recentLeaves = await Leave.find().sort({ createdAt: -1 }).limit(3).populate('user_id', 'full_name');
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(2);

    let recentActivities = [];
    
    recentUsers.forEach(u => {
      recentActivities.push({ action: 'New employee onboarded', who: u.full_name || u.email, time: u.createdAt });
    });
    recentLeaves.forEach(l => {
      recentActivities.push({ action: `Leave ${l.status}`, who: l.user_id ? (l.user_id.full_name || 'User') : 'Unknown', time: l.createdAt });
    });
    recentTasks.forEach(t => {
      recentActivities.push({ action: `Task ${t.status}`, who: t.assigned_to ? (t.assigned_to.full_name || 'User') : 'Unknown', time: t.createdAt });
    });

    // Sort combined activities by date descending and take top 5
    recentActivities.sort((a, b) => b.time - a.time);
    recentActivities = recentActivities.slice(0, 5).map(a => ({
      ...a,
      time: new Date(a.time).toLocaleDateString() // Simplistic formatting, better done on frontend
    }));

    res.json({
      stats: {
        totalEmployees,
        activeTasks,
        monthlyPayroll,
        pendingLeaves,
        totalTrainers,
        completedTasks
      },
      charts: {
        departmentDistribution,
        hiringTrend: hiringTrend.length > 0 ? hiringTrend : [{ month: 'N/A', hires: 0, exits: 0 }],
        performanceTrend
      },
      recentActivities
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
