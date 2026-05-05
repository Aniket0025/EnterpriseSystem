import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Users, CheckSquare, IndianRupee, Briefcase, TrendingUp, CalendarOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:5000/api";

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 67%, 52%)",
  "hsl(0, 84%, 60%)",
];

export default function Dashboard() {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-destructive">
        Error loading dashboard data.
      </div>
    );
  }

  const { stats, charts, recentActivities } = dashboardData;

  return (
    <div>
      <PageHeader title="Dashboard" description="Welcome back! Here's your organization overview." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          change="Active directory" 
          changeType="neutral" 
          icon={Users} 
          index={0} 
        />
        <StatsCard 
          title="Active Tasks" 
          value={stats.activeTasks} 
          change="Pending or in progress" 
          changeType="neutral" 
          icon={CheckSquare} 
          index={1} 
        />
        <StatsCard 
          title="Monthly Payroll" 
          value={`₹${(stats.monthlyPayroll / 1000).toFixed(1)}K`} 
          change="Total paid this month" 
          changeType="neutral" 
          icon={IndianRupee} 
          index={2} 
        />
        <StatsCard 
          title="Total Trainers" 
          value={stats.totalTrainers} 
          change="Active instructors" 
          changeType="neutral" 
          icon={Briefcase} 
          index={3} 
        />
        <StatsCard 
          title="Tasks Completed" 
          value={stats.completedTasks} 
          change="All time performance" 
          changeType="positive" 
          icon={TrendingUp} 
          index={4} 
        />
        <StatsCard 
          title="Pending Leaves" 
          value={stats.pendingLeaves} 
          change="Awaiting review" 
          changeType="negative" 
          icon={CalendarOff} 
          index={5} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold mb-4">Hiring Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="hires" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={charts.departmentDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {charts.departmentDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {charts.departmentDistribution.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold mb-4">Performance Trend (Tasks Completed)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity: any, i: number) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
              >
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.who} • {activity.time}</p>
                </div>
              </motion.div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-xs text-muted-foreground text-center pt-4">No recent activity.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
