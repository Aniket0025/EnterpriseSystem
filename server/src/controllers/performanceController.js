import Employee from '../models/Employee.js';
import Task from '../models/Task.js';

export const getPerformanceData = async (req, res) => {
  try {
    const employees = await Employee.find();
    const tasks = await Task.find();

    const employeePerformance = employees.map(emp => {
      const empTasks = tasks.filter(t => t.assigned_to && emp.user_id && t.assigned_to.toString() === emp.user_id.toString());
      const totalTasks = empTasks.length;
      const tasksCompleted = empTasks.filter(t => t.status === 'completed').length;
      
      let rating = 0;
      let trend = 'stable';
      
      if (totalTasks > 0) {
        const percentage = tasksCompleted / totalTasks;
        rating = Number((percentage * 5).toFixed(1));
        if (percentage >= 0.8) trend = 'up';
        else if (percentage <= 0.4) trend = 'down';
      }

      return {
        name: emp.name,
        department: emp.department || 'General',
        tasksCompleted,
        totalTasks,
        rating,
        trend
      };
    });

    // Calculate monthly average score based on completed tasks
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      let mIndex = currentMonth - i;
      if (mIndex < 0) mIndex += 12;
      
      // Get tasks for this month
      const monthTasks = tasks.filter(t => {
        const d = new Date(t.createdAt);
        return d.getMonth() === mIndex;
      });
      
      const mTotal = monthTasks.length;
      const mCompleted = monthTasks.filter(t => t.status === 'completed').length;
      
      let avgScore = mTotal > 0 ? Math.round((mCompleted / mTotal) * 100) : 0;
      
      monthlyData.push({
        month: months[mIndex],
        avgScore
      });
    }

    res.json({ employees: employeePerformance, monthlyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
