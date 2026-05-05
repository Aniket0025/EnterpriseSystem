import Payroll from '../models/Payroll.js';

export const getAnalyticsData = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year || new Date().getFullYear().toString();

    const payrolls = await Payroll.find();
    
    // Group by Quarter
    const quarterlyDataMap = {
      'Q1': { revenue: 1200000, expenses: 0 },
      'Q2': { revenue: 1350000, expenses: 0 },
      'Q3': { revenue: 1500000, expenses: 0 },
      'Q4': { revenue: 1420000, expenses: 0 },
    };

    payrolls.forEach(p => {
      if (p.month && p.month.startsWith(targetYear)) {
        const monthNum = parseInt(p.month.split('-')[1]);
        let quarter = 'Q1';
        if (monthNum >= 4 && monthNum <= 6) quarter = 'Q2';
        else if (monthNum >= 7 && monthNum <= 9) quarter = 'Q3';
        else if (monthNum >= 10 && monthNum <= 12) quarter = 'Q4';

        quarterlyDataMap[quarter].expenses += p.net_pay;
      }
    });

    const quarterlyData = Object.keys(quarterlyDataMap).map(q => ({
      quarter: q,
      revenue: quarterlyDataMap[q].revenue,
      expenses: quarterlyDataMap[q].expenses
    }));

    res.json({ quarterlyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
