import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, CheckSquare, IndianRupee, Briefcase, TrendingUp, CalendarOff, Loader2,
  GraduationCap, BookOpen, Clock, Coins, Shield, Target, Calendar,
  BarChart3, FileText, UserCheck, ArrowRight, AlertCircle, XCircle, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const COLORS = ["hsl(221, 83%, 53%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 67%, 52%)", "hsl(0, 84%, 60%)"];

function QuickLink({ icon: Icon, label, to, color }: { icon: any; label: string; to: string; color: string }) {
  const navigate = useNavigate();
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(to)}
      className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:shadow-md cursor-pointer transition-all">
      <div className={`p-2 rounded-lg ${color}`}><Icon className="h-5 w-5" /></div>
      <div className="flex-1"><p className="text-sm font-medium">{label}</p></div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </motion.div>
  );
}

function AdminDashboard({ data }: { data: any }) {
  const { stats, charts, recentActivities } = data;
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back! Here's your organization overview." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
        <StatsCard title="Employees" value={stats.totalEmployees} change="Active directory" changeType="neutral" icon={Users} index={0} />
        <StatsCard title="Trainers" value={stats.totalTrainers} change="Active instructors" changeType="neutral" icon={Briefcase} index={1} />
        <StatsCard title="Students" value={stats.totalStudents} change="Enrolled" changeType="neutral" icon={GraduationCap} index={2} />
        <StatsCard title="Active Batches" value={stats.activeBatches} change="Running" changeType="neutral" icon={BookOpen} index={3} />
        <StatsCard title="Active Tasks" value={stats.activeTasks} change="In progress" changeType="neutral" icon={CheckSquare} index={4} />
        <StatsCard title="Completed" value={stats.completedTasks} change="All time" changeType="positive" icon={TrendingUp} index={5} />
        <StatsCard title="Monthly Payroll" value={`₹${(stats.monthlyPayroll / 1000).toFixed(1)}K`} change="Total paid" changeType="neutral" icon={IndianRupee} index={6} />
        <StatsCard title="Pending Leaves" value={stats.pendingLeaves} change="Awaiting review" changeType="negative" icon={CalendarOff} index={7} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div className="rounded-xl border bg-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="font-semibold mb-4">Hiring Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.hiringTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="hires" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div className="rounded-xl border bg-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-semibold mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={charts.departmentDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
              {charts.departmentDistribution.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {charts.departmentDistribution.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs"><div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />{item.name}</div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2 rounded-xl border bg-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="font-semibold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.performanceTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line type="monotone" dataKey="score" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div className="rounded-xl border bg-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity: any, i: number) => (
              <motion.div key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.05 }}>
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div><p className="text-sm font-medium">{activity.action}</p><p className="text-xs text-muted-foreground">{activity.who} • {activity.time}</p></div>
              </motion.div>
            ))}
            {recentActivities.length === 0 && <p className="text-xs text-muted-foreground text-center pt-4">No recent activity.</p>}
          </div>
        </motion.div>
      </div>
    </>
  );
}

function EmployeeDashboard({ data }: { data: any }) {
  const { stats, recentTasks } = data;
  const navigate = useNavigate();
  const priorityColor = (p: string) => p === "high" ? "bg-red-100 text-red-700" : p === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";
  const statusColor = (s: string) => s === "completed" ? "bg-emerald-100 text-emerald-700" : s === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700";
  return (
    <>
      <PageHeader title="My Dashboard" description="Your work overview and tasks at a glance" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard title="Total Tasks" value={stats.totalTasks} change="Assigned to you" changeType="neutral" icon={CheckSquare} index={0} />
        <StatsCard title="Active Tasks" value={stats.activeTasks} change="Pending or in progress" changeType="neutral" icon={Target} index={1} />
        <StatsCard title="Completed" value={stats.completedTasks} change="All time" changeType="positive" icon={TrendingUp} index={2} />
        <StatsCard title="Pending Leaves" value={stats.pendingLeaves} change="Awaiting approval" changeType="negative" icon={CalendarOff} index={3} />
        <StatsCard title="Approved Leaves" value={stats.approvedLeaves} change="Approved" changeType="positive" icon={Calendar} index={4} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-2"><CardHeader className="pb-3">
            <div className="flex items-center justify-between"><CardTitle className="text-lg flex items-center gap-2"><CheckSquare className="h-5 w-5 text-primary" />My Tasks</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>View All</Button></div>
          </CardHeader><CardContent>
            {recentTasks.length === 0 ? (<p className="text-muted-foreground text-center py-8">No tasks assigned yet.</p>) : (
              <div className="space-y-3">{recentTasks.map((t: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition-shadow">
                  <div><p className="text-sm font-semibold">{t.title}</p><p className="text-xs text-muted-foreground mt-0.5">{t.deadline ? `Due: ${new Date(t.deadline).toLocaleDateString()}` : "No deadline"}</p></div>
                  <div className="flex gap-2"><Badge className={`text-[10px] ${priorityColor(t.priority)}`}>{t.priority}</Badge><Badge className={`text-[10px] capitalize ${statusColor(t.status)}`}>{t.status?.replace('_', ' ')}</Badge></div>
                </motion.div>
              ))}</div>
            )}
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-2"><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><ArrowRight className="h-5 w-5 text-primary" />Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <QuickLink icon={CheckSquare} label="My Tasks" to="/tasks" color="bg-blue-100 text-blue-600" />
            <QuickLink icon={CalendarOff} label="Apply Leave" to="/leave" color="bg-amber-100 text-amber-600" />
            <QuickLink icon={FileText} label="Daily Reports" to="/daily-reports" color="bg-emerald-100 text-emerald-600" />
            <QuickLink icon={BarChart3} label="Reports" to="/reports" color="bg-purple-100 text-purple-600" />
          </CardContent></Card>
        </motion.div>
      </div>
    </>
  );
}

function TrainerDashboard({ data }: { data: any }) {
  const { stats, recentBatches } = data;
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Trainer Dashboard" description="Manage your batches and student attendance" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-l-4 border-l-blue-500"><CardContent className="p-5">
            <div className="flex items-center gap-3"><div className="p-3 rounded-xl bg-blue-100"><BookOpen className="h-6 w-6 text-blue-600" /></div>
            <div><p className="text-sm text-muted-foreground">Total Batches</p><p className="text-3xl font-bold text-blue-600">{stats.totalBatches}</p></div></div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-l-4 border-l-emerald-500"><CardContent className="p-5">
            <div className="flex items-center gap-3"><div className="p-3 rounded-xl bg-emerald-100"><UserCheck className="h-6 w-6 text-emerald-600" /></div>
            <div><p className="text-sm text-muted-foreground">Active Batches</p><p className="text-3xl font-bold text-emerald-600">{stats.activeBatches}</p></div></div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-amber-500"><CardContent className="p-5">
            <div className="flex items-center gap-3"><div className="p-3 rounded-xl bg-amber-100"><GraduationCap className="h-6 w-6 text-amber-600" /></div>
            <div><p className="text-sm text-muted-foreground">Total Students</p><p className="text-3xl font-bold text-amber-600">{stats.totalStudents}</p></div></div>
          </CardContent></Card>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-2"><CardHeader className="pb-3">
            <div className="flex items-center justify-between"><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />My Batches</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/batches")}>View All</Button></div>
          </CardHeader><CardContent>
            {recentBatches.length === 0 ? (<p className="text-muted-foreground text-center py-8">No batches assigned yet.</p>) : (
              <div className="space-y-3">{recentBatches.map((b: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition-shadow">
                  <div><p className="text-sm font-semibold">{b.name}</p><p className="text-xs text-muted-foreground mt-0.5">{b.course} • {b.timing || "No timing set"}</p></div>
                  <div className="text-right"><p className="text-xs text-muted-foreground">Start</p><p className="text-xs font-medium">{b.startDate ? new Date(b.startDate).toLocaleDateString() : "—"}</p></div>
                </motion.div>
              ))}</div>
            )}
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-2"><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><ArrowRight className="h-5 w-5 text-primary" />Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <QuickLink icon={Clock} label="Mark Attendance" to="/attendance" color="bg-emerald-100 text-emerald-600" />
            <QuickLink icon={BookOpen} label="My Batches" to="/batches" color="bg-blue-100 text-blue-600" />
            <QuickLink icon={CheckSquare} label="My Tasks" to="/tasks" color="bg-amber-100 text-amber-600" />
            <QuickLink icon={FileText} label="Daily Reports" to="/daily-reports" color="bg-purple-100 text-purple-600" />
          </CardContent></Card>
        </motion.div>
      </div>
    </>
  );
}

function StudentDashboard({ data }: { data: any }) {
  const { stats, batches } = data;
  const navigate = useNavigate();
  const pctColor = stats.attendancePct >= 75 ? "text-emerald-600" : stats.attendancePct >= 50 ? "text-amber-600" : "text-red-600";
  const pctBg = stats.attendancePct >= 75 ? "bg-emerald-500" : stats.attendancePct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <>
      <PageHeader title="Student Dashboard" description="Track your learning progress and attendance" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { title: "My Batches", value: stats.totalBatches, icon: BookOpen, color: "border-l-blue-500", bg: "bg-blue-100", text: "text-blue-600" },
          { title: "Credits", value: stats.credits, icon: Coins, color: "border-l-amber-500", bg: "bg-amber-100", text: "text-amber-600" },
          { title: "Attendance %", value: `${stats.attendancePct}%`, icon: BarChart3, color: "border-l-emerald-500", bg: "bg-emerald-100", text: pctColor },
          { title: "Present Days", value: stats.presentDays, icon: CheckSquare, color: "border-l-green-500", bg: "bg-green-100", text: "text-green-600" },
          { title: "Total Days", value: stats.totalDays, icon: Calendar, color: "border-l-slate-500", bg: "bg-slate-100", text: "text-slate-600" },
          { title: "Status", value: stats.status, icon: GraduationCap, color: "border-l-purple-500", bg: "bg-purple-100", text: "text-purple-600" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-l-4 ${s.color}`}><CardContent className="p-4">
              <div className="flex items-center gap-3"><div className={`p-2.5 rounded-xl ${s.bg}`}><s.icon className={`h-5 w-5 ${s.text}`} /></div>
              <div><p className="text-xs text-muted-foreground font-medium">{s.title}</p><p className={`text-2xl font-bold ${s.text} capitalize`}>{s.value}</p></div></div>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium">Attendance Progress</p><p className={`text-sm font-bold ${pctColor}`}>{stats.attendancePct}%</p></div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${stats.attendancePct}%` }} transition={{ duration: 1, delay: 0.5 }} className={`h-full rounded-full ${pctBg}`} />
          </div>
        </CardContent></Card>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-2"><CardHeader className="pb-3">
            <div className="flex items-center justify-between"><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />My Batches</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/attendance")}>View Attendance</Button></div>
          </CardHeader><CardContent>
            {batches.length === 0 ? (<div className="text-center py-8"><BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">You're not enrolled in any batch yet.</p></div>) : (
              <div className="space-y-3">{batches.map((b: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition-shadow">
                  <div><p className="text-sm font-semibold">{b.name}</p><p className="text-xs text-muted-foreground mt-0.5">{b.course}</p></div>
                  <div className="text-right"><p className="text-xs text-muted-foreground">Trainer</p><p className="text-xs font-medium">{b.trainer || "—"}</p><p className="text-[10px] text-muted-foreground mt-0.5">{b.timing || ""}</p></div>
                </motion.div>
              ))}</div>
            )}
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-2"><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><ArrowRight className="h-5 w-5 text-primary" />Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <QuickLink icon={Clock} label="My Attendance" to="/attendance" color="bg-emerald-100 text-emerald-600" />
            <QuickLink icon={CheckSquare} label="My Tasks" to="/tasks" color="bg-blue-100 text-blue-600" />
            <QuickLink icon={CalendarOff} label="Apply Leave" to="/leave" color="bg-amber-100 text-amber-600" />
            <QuickLink icon={Coins} label="My Credits" to="/settings" color="bg-purple-100 text-purple-600" />
          </CardContent></Card>
        </motion.div>
      </div>
    </>
  );
}

function InternDashboard({ data }: { data: any }) {
  const { stats, recentMeetings } = data;
  const navigate = useNavigate();
  const pct = stats.attendancePct || 0;
  const pctColor = pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600";
  const pctBg = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  const meetStatusColor = (s: string) => s === "present" ? "bg-emerald-100 text-emerald-700" : s === "late" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  const meetStatusIcon = (s: string) => s === "present" ? CheckCircle2 : s === "late" ? AlertCircle : XCircle;

  return (
    <>
      <PageHeader title="Intern Dashboard" description="Track your internship progress and meeting attendance" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { title: "Total Meetings", value: stats.totalMeetings, icon: Calendar, color: "border-l-blue-500", bg: "bg-blue-100", text: "text-blue-600" },
          { title: "Present", value: stats.presentMeetings, icon: CheckSquare, color: "border-l-emerald-500", bg: "bg-emerald-100", text: "text-emerald-600" },
          { title: "Late", value: stats.lateMeetings, icon: AlertCircle, color: "border-l-amber-500", bg: "bg-amber-100", text: "text-amber-600" },
          { title: "Absent", value: stats.absentMeetings, icon: XCircle, color: "border-l-red-500", bg: "bg-red-100", text: "text-red-600" },
          { title: "Attendance %", value: `${pct}%`, icon: BarChart3, color: "border-l-purple-500", bg: "bg-purple-100", text: pctColor },
          { title: "Status", value: stats.status, icon: GraduationCap, color: "border-l-slate-500", bg: "bg-slate-100", text: "text-slate-600" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-l-4 ${s.color}`}><CardContent className="p-4">
              <div className="flex items-center gap-3"><div className={`p-2.5 rounded-xl ${s.bg}`}><s.icon className={`h-5 w-5 ${s.text}`} /></div>
              <div><p className="text-xs text-muted-foreground font-medium">{s.title}</p><p className={`text-2xl font-bold ${s.text} capitalize`}>{s.value}</p></div></div>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium">Attendance Progress</p><p className={`text-sm font-bold ${pctColor}`}>{pct}%</p></div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }} className={`h-full rounded-full ${pctBg}`} />
          </div>
        </CardContent></Card>
      </motion.div>

      {(stats.department || stats.mentor || stats.university) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
          <Card><CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              {stats.department && <div><p className="text-muted-foreground text-xs">Department</p><p className="font-medium">{stats.department}</p></div>}
              {stats.mentor && <div><p className="text-muted-foreground text-xs">Mentor</p><p className="font-medium">{stats.mentor}</p></div>}
              {stats.university && <div><p className="text-muted-foreground text-xs">University</p><p className="font-medium">{stats.university}</p></div>}
            </div>
          </CardContent></Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-2"><CardHeader className="pb-3">
            <div className="flex items-center justify-between"><CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Recent Meetings</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/attendance")}>View All</Button></div>
          </CardHeader><CardContent>
            {!recentMeetings?.length ? (
              <div className="text-center py-8"><Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No meetings recorded yet.</p></div>
            ) : (
              <div className="space-y-3">{recentMeetings.map((m: any, i: number) => {
                const Icon = meetStatusIcon(m.status);
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${m.status === "present" ? "text-emerald-600" : m.status === "late" ? "text-amber-600" : "text-red-600"}`} />
                      <div><p className="text-sm font-semibold">{m.title}</p><p className="text-xs text-muted-foreground mt-0.5">{new Date(m.date).toLocaleDateString()} {m.notes && `• ${m.notes}`}</p></div>
                    </div>
                    <Badge className={meetStatusColor(m.status)}>{m.status}</Badge>
                  </motion.div>
                );
              })}</div>
            )}
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-2"><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><ArrowRight className="h-5 w-5 text-primary" />Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <QuickLink icon={Clock} label="My Attendance" to="/attendance" color="bg-emerald-100 text-emerald-600" />
            <QuickLink icon={CheckSquare} label="My Tasks" to="/tasks" color="bg-blue-100 text-blue-600" />
            <QuickLink icon={CalendarOff} label="Apply Leave" to="/leave" color="bg-amber-100 text-amber-600" />
            <QuickLink icon={FileText} label="Daily Reports" to="/daily-reports" color="bg-purple-100 text-purple-600" />
          </CardContent></Card>
        </motion.div>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { user, role } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
    enabled: !!user
  });

  if (isLoading) return (<div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>);
  if (error || !dashboardData) return (<div className="flex h-[80vh] items-center justify-center text-destructive">Error loading dashboard data.</div>);

  const dashboardRole = dashboardData.role || role;
  if (dashboardRole === "intern") return <InternDashboard data={dashboardData} />;
  if (dashboardRole === "employee") return <EmployeeDashboard data={dashboardData} />;
  if (dashboardRole === "trainer") return <TrainerDashboard data={dashboardData} />;
  if (dashboardRole === "student") return <StudentDashboard data={dashboardData} />;
  return <AdminDashboard data={dashboardData} />;
}
