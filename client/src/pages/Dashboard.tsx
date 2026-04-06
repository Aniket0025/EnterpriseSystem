import { StatsCard } from "@/components/shared/StatsCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Users, CheckSquare, DollarSign, UserPlus, TrendingUp, CalendarOff } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const barData = [
  { month: "Jan", hires: 4, exits: 1 },
  { month: "Feb", hires: 6, exits: 2 },
  { month: "Mar", hires: 3, exits: 1 },
  { month: "Apr", hires: 8, exits: 0 },
  { month: "May", hires: 5, exits: 3 },
  { month: "Jun", hires: 7, exits: 1 },
];

const pieData = [
  { name: "Engineering", value: 35 },
  { name: "Marketing", value: 20 },
  { name: "Sales", value: 25 },
  { name: "HR", value: 10 },
  { name: "Design", value: 10 },
];

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 67%, 52%)",
  "hsl(0, 84%, 60%)",
];

const performanceData = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 75 },
  { month: "Mar", score: 80 },
  { month: "Apr", score: 78 },
  { month: "May", score: 85 },
  { month: "Jun", score: 88 },
];

const recentActivities = [
  { action: "New employee onboarded", who: "John Smith", time: "2 hours ago" },
  { action: "Leave approved", who: "Sarah Wilson", time: "3 hours ago" },
  { action: "Task completed", who: "Mike Johnson", time: "5 hours ago" },
  { action: "Interview scheduled", who: "Emma Davis", time: "1 day ago" },
  { action: "Payroll processed", who: "System", time: "1 day ago" },
];

export default function Dashboard() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Welcome back! Here's your organization overview." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Employees" value={248} change="+12 this month" changeType="positive" icon={Users} index={0} />
        <StatsCard title="Active Tasks" value={42} change="8 overdue" changeType="negative" icon={CheckSquare} index={1} />
        <StatsCard title="Monthly Payroll" value="$425K" change="+3.2%" changeType="neutral" icon={DollarSign} index={2} />
        <StatsCard title="Open Positions" value={15} change="5 interviews today" changeType="neutral" icon={UserPlus} index={3} />
        <StatsCard title="Avg Performance" value="85%" change="+5% vs last month" changeType="positive" icon={TrendingUp} index={4} />
        <StatsCard title="Pending Leaves" value={7} change="3 urgent" changeType="negative" icon={CalendarOff} index={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold mb-4">Hiring vs Exits</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="hires" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exits" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
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
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
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
          <h3 className="font-semibold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={performanceData}>
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
            {recentActivities.map((activity, i) => (
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
