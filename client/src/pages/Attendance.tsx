import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Calendar, CheckCircle, XCircle, AlertCircle, Users, UserPlus,
  Search, Loader2, History, Edit2, Trash2, Coins, GraduationCap,
  ChevronLeft, ChevronRight, Save, Shield, BookOpen, UserCheck
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function StatusPill({ status, selected, onClick }: { status: string; selected: boolean; onClick: () => void }) {
  const colors: Record<string, string> = {
    present: selected ? "bg-emerald-500 text-white shadow-emerald-200 shadow-md" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    absent: selected ? "bg-red-500 text-white shadow-red-200 shadow-md" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    late: selected ? "bg-amber-500 text-white shadow-amber-200 shadow-md" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  };
  const icons: Record<string, any> = { present: CheckCircle, absent: XCircle, late: AlertCircle };
  const Icon = icons[status];
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 border ${colors[status]} flex items-center gap-1.5`}>
      <Icon className="h-3.5 w-3.5" />{status}
    </button>
  );
}

function AttendanceDayCell({ date, records, onClick }: { date: Date; records: any[]; onClick: () => void }) {
  const present = records.filter(r => r.status === "present").length;
  const absent = records.filter(r => r.status === "absent").length;
  const late = records.filter(r => r.status === "late").length;
  const total = records.length;
  const isToday = isSameDay(date, new Date());
  const hasData = total > 0;
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`relative p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 min-h-[80px]
        ${isToday ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}
        ${hasData ? "" : "opacity-50"}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-bold ${isToday ? "text-primary" : "text-muted-foreground"}`}>{format(date, "d")}</span>
        <span className="text-[10px] text-muted-foreground">{DAY_NAMES[getDay(date)]}</span>
      </div>
      {hasData ? (
        <div className="flex gap-1 flex-wrap">
          {present > 0 && <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-full px-1.5 py-0.5"><CheckCircle className="h-2.5 w-2.5" />{present}</span>}
          {absent > 0 && <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-red-100 text-red-700 rounded-full px-1.5 py-0.5"><XCircle className="h-2.5 w-2.5" />{absent}</span>}
          {late > 0 && <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5"><AlertCircle className="h-2.5 w-2.5" />{late}</span>}
        </div>
      ) : (<p className="text-[10px] text-muted-foreground/60 mt-1">No data</p>)}
    </motion.div>
  );
}

function StudentCalendarView({ attendance }: { attendance: any[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(new Date(currentYear, currentMonth));
  const monthEnd = endOfMonth(new Date(currentYear, currentMonth));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const byDate: Record<string, any[]> = {};
  attendance.forEach(a => { if (!byDate[a.date]) byDate[a.date] = []; byDate[a.date].push(a); });

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); setSelectedDate(null); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); setSelectedDate(null); };

  const selectedRecords = selectedDate ? byDate[format(selectedDate, "yyyy-MM-dd")] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />{MONTH_NAMES[currentMonth]} {currentYear}</CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => { setCurrentMonth(new Date().getMonth()); setCurrentYear(new Date().getFullYear()); setSelectedDate(null); }}>Today</Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_NAMES.map(d => <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDay(monthStart) }, (_, i) => <div key={`empty-${i}`} />)}
              {days.map(day => (
                <AttendanceDayCell key={day.toISOString()} date={day} records={byDate[format(day, "yyyy-MM-dd")] || []} onClick={() => setSelectedDate(day)} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t">
              <span className="flex items-center gap-1.5 text-xs"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Present</span>
              <span className="flex items-center gap-1.5 text-xs"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Absent</span>
              <span className="flex items-center gap-1.5 text-xs"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Late</span>
              <span className="flex items-center gap-1.5 text-xs"><span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />Today</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <AnimatePresence mode="wait">
          {selectedDate ? (
            <motion.div key={format(selectedDate, "yyyy-MM-dd")} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedRecords.length} record{selectedRecords.length !== 1 ? "s" : ""}</p>
                </CardHeader>
                <CardContent>
                  {selectedRecords.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No records for this date</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedRecords.map((r: any) => (
                        <div key={r._id || r.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div><p className="text-sm font-medium">{r.batch_id?.name || "—"}</p><p className="text-xs text-muted-foreground">{r.batch_id?.course || ""}</p></div>
                          <StatusPill status={r.status} selected={true} onClick={() => {}} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">Select a date</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Click on a day to view details</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InternAttendanceView() {
  const token = localStorage.getItem("token");
  const [internProfile, setInternProfile] = useState<any>(null);
  const [internLoading, setInternLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchInternProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/interns/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setInternProfile(data);
      } catch (err) { console.error(err); }
      setInternLoading(false);
    };
    fetchInternProfile();
  }, []);

  if (internLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const pct = internProfile?.attendancePct || 0;
  const pctColor = pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600";
  const pctBg = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      <PageHeader title="My Meeting Attendance" description="Track your meeting attendance and progress" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { title: "Total Meetings", value: internProfile?.totalMeetings || 0, icon: Calendar, color: "border-l-blue-500", bg: "bg-blue-100", text: "text-blue-600" },
          { title: "Present", value: internProfile?.presentMeetings || 0, icon: CheckCircle, color: "border-l-emerald-500", bg: "bg-emerald-100", text: "text-emerald-600" },
          { title: "Late", value: internProfile?.lateMeetings || 0, icon: AlertCircle, color: "border-l-amber-500", bg: "bg-amber-100", text: "text-amber-600" },
          { title: "Absent", value: internProfile?.absentMeetings || 0, icon: XCircle, color: "border-l-red-500", bg: "bg-red-100", text: "text-red-600" },
          { title: "Attendance %", value: `${pct}%`, icon: Clock, color: "border-l-purple-500", bg: "bg-purple-100", text: pctColor },
          { title: "Status", value: internProfile?.status || "active", icon: GraduationCap, color: "border-l-slate-500", bg: "bg-slate-100", text: "text-slate-600" },
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Label>Filter by Month</Label>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                  <SelectItem key={i} value={i + 1}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Year</Label>
            <Input type="number" value={filterYear} onChange={e => setFilterYear(parseInt(e.target.value))} className="w-[100px]" />
          </div>
        </CardContent></Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-2"><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><History className="h-5 w-5 text-primary" />Meeting History</CardTitle></CardHeader>
        <CardContent>
          {!internProfile?.meeting_attendance?.length ? (
            <div className="text-center py-8"><Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No meetings recorded yet.</p></div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {[...internProfile.meeting_attendance].reverse().filter((m: any) => {
                const meetingDate = new Date(m.meeting_date);
                return meetingDate.getMonth() + 1 === filterMonth && meetingDate.getFullYear() === filterYear;
              }).map((m: any, i: number) => {
                const Icon = m.status === "present" ? CheckCircle : m.status === "late" ? AlertCircle : XCircle;
                const stColor = m.status === "present" ? "bg-emerald-100 text-emerald-700" : m.status === "late" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${m.status === "present" ? "text-emerald-600" : m.status === "late" ? "text-amber-600" : "text-red-600"}`} />
                      <div><p className="text-sm font-medium">{m.meeting_title}</p><p className="text-xs text-muted-foreground">{new Date(m.meeting_date).toLocaleDateString()} {m.notes && `• ${m.notes}`}</p></div>
                    </div>
                    <Badge className={stColor}>{m.status}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent></Card>
      </motion.div>
    </div>
  );
}

export default function Attendance() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = role === "super_admin" || role === "hr_admin";
  const isTrainer = role === "trainer";
  const isStudent = role === "student";
  const isEmployee = role === "employee";
  const isIntern = role === "intern";

  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batchStudents, setBatchStudents] = useState<any[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [studentStatuses, setStudentStatuses] = useState<Record<string, string>>({});

  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [addingStudent, setAddingStudent] = useState(false);

  const [historyMonth, setHistoryMonth] = useState(format(new Date(), "MM"));
  const [historyYear, setHistoryYear] = useState(format(new Date(), "yyyy"));
  const [historyDate, setHistoryDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [historyFilterMode, setHistoryFilterMode] = useState<"month" | "date">("month");
  const [attendanceHistory, setAttendanceHistory] = useState<Record<string, any[]>>({});
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editStatuses, setEditStatuses] = useState<Record<string, string>>({});

  const [myAttendance, setMyAttendance] = useState<any[]>([]);
  const [myCredits, setMyCredits] = useState<number>(0);
  const [myStatus, setMyStatus] = useState<string>("active");

  // Employee - no access
  if (isEmployee) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground/70 mt-2">Batch attendance is available for HR, Trainers, and Students only.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  // Intern - show own meeting attendance
  if (isIntern) return <InternAttendanceView />;


  const fetchBatches = useCallback(async () => {
    try {
      const url = isTrainer ? `${API_URL}/attendance/trainer-batches` : `${API_URL}/batches`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBatches(data);
      if (data.length > 0 && !selectedBatch) setSelectedBatch(data[0]._id);
    } catch (err) { console.error(err); }
  }, [token, isTrainer]);

  const fetchBatchStudents = useCallback(async () => {
    if (!selectedBatch) return;
    try {
      const res = await fetch(`${API_URL}/attendance/batch/${selectedBatch}/students`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBatchStudents(data);
      const attRes = await fetch(`${API_URL}/attendance/batch/${selectedBatch}/attendance?date=${attendanceDate}`, { headers: { Authorization: `Bearer ${token}` } });
      const attData = await attRes.json();
      const statuses: Record<string, string> = {};
      data.forEach((s: any) => { statuses[s.student_id] = "present"; });
      (attData || []).forEach((a: any) => { statuses[a.student_id._id || a.student_id] = a.status; });
      setStudentStatuses(statuses);
    } catch (err) { console.error(err); }
  }, [selectedBatch, attendanceDate, token]);

  const fetchHistory = useCallback(async () => {
    if (!selectedBatch) return;
    try {
      const res = await fetch(`${API_URL}/attendance/batch/${selectedBatch}/attendance/history?month=${historyMonth}&year=${historyYear}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAttendanceHistory(data);
    } catch (err) { console.error(err); }
  }, [selectedBatch, historyMonth, historyYear, token]);

  const fetchMyAttendance = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/attendance/my-attendance`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMyAttendance(data);
    } catch (err) { console.error(err); }
  }, [token]);

  const searchStudents = async (q: string) => {
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const res = await fetch(`${API_URL}/attendance/students/search?q=${encodeURIComponent(q)}`, { headers: { Authorization: `Bearer ${token}` } });
      setSearchResults(await res.json());
    } catch (err) { console.error(err); }
  };

  const addStudentToBatch = async (studentId: string) => {
    setAddingStudent(true);
    try {
      const res = await fetch(`${API_URL}/attendance/batch/${selectedBatch}/students`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ student_id: studentId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Student added to batch" });
      fetchBatchStudents(); setSearchQuery(""); setSearchResults([]);
    } catch (err: any) { toast({ title: err.message || "Error", variant: "destructive" }); }
    finally { setAddingStudent(false); }
  };

  const removeStudentFromBatch = async (studentId: string) => {
    try {
      const res = await fetch(`${API_URL}/attendance/batch/${selectedBatch}/students/${studentId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Student removed" }); fetchBatchStudents();
    } catch (err: any) { toast({ title: err.message || "Error", variant: "destructive" }); }
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const records = Object.entries(studentStatuses).map(([student_id, status]) => ({ student_id, status }));
      const res = await fetch(`${API_URL}/attendance/batch/${selectedBatch}/attendance`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: attendanceDate, records })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Attendance saved", description: `Marked for ${records.length} students` });
      fetchHistory();
    } catch (err: any) { toast({ title: err.message || "Error", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const startEditing = (date: string, records: any[]) => {
    setEditingDate(date);
    const statuses: Record<string, string> = {};
    records.forEach(r => { statuses[r.student_id] = r.status; });
    setEditStatuses(statuses);
  };

  const saveEditedAttendance = async (date: string) => {
    setLoading(true);
    try {
      const records = Object.entries(editStatuses).map(([student_id, status]) => ({ student_id, status }));
      const res = await fetch(`${API_URL}/attendance/batch/${selectedBatch}/attendance`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date, records })
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Attendance updated" }); setEditingDate(null); fetchHistory();
    } catch (err: any) { toast({ title: err.message || "Error", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const fetchMyProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/students/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setMyCredits(data.credits || 0); setMyStatus(data.status || "active"); }
    } catch (err) { console.error(err); }
  }, [token]);

  useEffect(() => { if (isStudent) { fetchMyAttendance(); fetchMyProfile(); } else fetchBatches(); }, [isStudent, fetchBatches, fetchMyAttendance, fetchMyProfile]);
  useEffect(() => { if (selectedBatch && !isStudent) fetchBatchStudents(); }, [selectedBatch, attendanceDate, fetchBatchStudents]);
  useEffect(() => { if (selectedBatch && !isStudent) fetchHistory(); }, [selectedBatch, historyMonth, historyYear, fetchHistory]);

  // ===== STUDENT VIEW =====
  if (isStudent) {
    const presentDays = myAttendance.filter(a => a.status === "present").length;
    const absentDays = myAttendance.filter(a => a.status === "absent").length;
    const lateDays = myAttendance.filter(a => a.status === "late").length;
    const total = myAttendance.length;
    const pct = total > 0 ? Math.round(((presentDays + lateDays) / total) * 100) : 0;

    return (
      <div>
        <PageHeader title="My Attendance" description="Track your attendance, credits, and progress" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { title: "Present", value: presentDays, icon: CheckCircle, color: "border-l-emerald-500", bg: "bg-emerald-100", text: "text-emerald-600" },
            { title: "Late", value: lateDays, icon: AlertCircle, color: "border-l-amber-500", bg: "bg-amber-100", text: "text-amber-600" },
            { title: "Absent", value: absentDays, icon: XCircle, color: "border-l-red-500", bg: "bg-red-100", text: "text-red-600" },
            { title: "Attendance %", value: `${pct}%`, icon: Calendar, color: "border-l-primary", bg: "bg-primary/10", text: "text-primary" },
            { title: "Credits", value: myCredits, icon: Coins, color: "border-l-amber-400", bg: "bg-amber-50", text: "text-amber-500" },
            { title: "Status", value: myStatus, icon: GraduationCap, color: "border-l-blue-500", bg: "bg-blue-100", text: "text-blue-600" },
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
            <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium">Overall Attendance</p><p className="text-sm font-bold">{pct}%</p></div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }}
                className={`h-full rounded-full ${pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground"><span>{presentDays + lateDays} days attended</span><span>{total} total days</span></div>
          </CardContent></Card>
        </motion.div>
        <StudentCalendarView attendance={myAttendance} />
      </div>
    );
  }

  // ===== HR / TRAINER VIEW =====
  const selectedBatchInfo = batches.find(b => b._id === selectedBatch);
  const presentCount = Object.values(studentStatuses).filter(s => s === "present").length;
  const absentCount = Object.values(studentStatuses).filter(s => s === "absent").length;
  const lateCount = Object.values(studentStatuses).filter(s => s === "late").length;

  return (
    <div>
      <PageHeader title="Batch Attendance" description={isTrainer ? "Mark and manage attendance for your assigned batches" : "Manage batch attendance, students, and history"} />
      <div className="mb-4">
        <Badge variant="outline" className="capitalize text-xs">
          {isTrainer ? <><GraduationCap className="h-3 w-3 mr-1" />Trainer View — Assigned Batches Only</> : <><Shield className="h-3 w-3 mr-1" />Admin View — All Batches</>}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 space-y-4">
          <Card className="border-2">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Select Batch</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choose batch..." /></SelectTrigger>
                <SelectContent>{batches.map(b => <SelectItem key={b._id} value={b._id}>{b.name} — {b.course}</SelectItem>)}</SelectContent>
              </Select>
              {selectedBatchInfo && (
                <div className="p-3 rounded-lg bg-muted/50 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Course</span><span className="font-medium">{selectedBatchInfo.course}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Trainer</span><span className="font-medium">{selectedBatchInfo.trainer_id?.name || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Timing</span><span className="font-medium">{selectedBatchInfo.class_timing || "—"}</span></div>
                </div>
              )}
              <div><Label className="text-xs font-medium">Attendance Date</Label><Input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} className="mt-1" /></div>
              {batches.length === 0 && (
                <div className="text-center py-4"><BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" /><p className="text-xs text-muted-foreground">{isTrainer ? "No batches assigned to you" : "No active batches"}</p></div>
              )}
            </CardContent>
          </Card>
          {selectedBatch && batchStudents.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-2">
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><UserCheck className="h-4 w-4 text-primary" />Quick Stats</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Total</span><span className="font-bold text-lg">{batchStudents.length}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Present</span><span className="font-bold text-emerald-600">{presentCount}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Absent</span><span className="font-bold text-red-600">{absentCount}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Late</span><span className="font-bold text-amber-600">{lateCount}</span></div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between mb-1 text-xs"><span>Attendance Rate</span><span className="font-bold">{batchStudents.length > 0 ? Math.round((presentCount / batchStudents.length) * 100) : 0}%</span></div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${presentCount / batchStudents.length >= 0.75 ? "bg-emerald-500" : presentCount / batchStudents.length >= 0.5 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${batchStudents.length > 0 ? (presentCount / batchStudents.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Main content */}
        <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {selectedBatch ? (
            <Tabs defaultValue="mark" className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="mark" className="gap-1.5"><Clock className="h-4 w-4" />Mark</TabsTrigger>
                  <TabsTrigger value="students" className="gap-1.5"><Users className="h-4 w-4" />Students</TabsTrigger>
                  <TabsTrigger value="history" className="gap-1.5"><History className="h-4 w-4" />History</TabsTrigger>
                </TabsList>
                <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
                  <Button variant="outline" size="sm" onClick={() => setAddStudentOpen(true)}><UserPlus className="h-4 w-4 mr-2" />Add Student</Button>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Student to Batch</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search students by name or email..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); searchStudents(e.target.value); }} className="pl-10" /></div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {searchResults.map(s => (
                          <div key={s._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{(s.full_name || "U").charAt(0)}</div>
                              <div><p className="text-sm font-medium">{s.full_name}</p><p className="text-xs text-muted-foreground">{s.email}</p></div>
                            </div>
                            <Button size="sm" onClick={() => addStudentToBatch(s._id)} disabled={addingStudent}><UserPlus className="h-3 w-3 mr-1" />Add</Button>
                          </div>
                        ))}
                        {searchQuery.length >= 2 && searchResults.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No students found</p>}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Mark Attendance */}
              <TabsContent value="mark">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Mark Attendance</CardTitle>
                      <Badge variant="outline" className="text-xs">{attendanceDate}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {batchStudents.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><Users className="h-8 w-8 text-muted-foreground/50" /></div>
                        <p className="text-muted-foreground font-medium">No students enrolled</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Add students using the "Add Student" button</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {batchStudents.map((student, idx) => (
                            <motion.div key={student.student_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                              className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                                  {(student.full_name || "U").charAt(0).toUpperCase()}
                                </div>
                                <div><p className="text-sm font-semibold">{student.full_name || "Unnamed"}</p><p className="text-xs text-muted-foreground">{student.email}</p></div>
                              </div>
                              <div className="flex gap-1.5">
                                {["present", "absent", "late"].map(status => (
                                  <StatusPill key={status} status={status} selected={studentStatuses[student.student_id] === status}
                                    onClick={() => setStudentStatuses(prev => ({ ...prev, [student.student_id]: status }))} />
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <Button className="w-full mt-6 h-11 text-base font-semibold" onClick={handleSaveAttendance} disabled={loading}>
                          {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Saving...</> : <><Save className="h-5 w-5 mr-2" />Save Attendance</>}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Students */}
              <TabsContent value="students">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Enrolled Students<Badge variant="secondary" className="ml-2">{batchStudents.length}</Badge></CardTitle>
                  </CardHeader>
                  <CardContent>
                    {batchStudents.length === 0 ? (
                      <div className="text-center py-12"><Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No students enrolled yet.</p></div>
                    ) : (
                      <div className="space-y-2">
                        {batchStudents.map((student, idx) => (
                          <motion.div key={student.student_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{(student.full_name || "U").charAt(0).toUpperCase()}</div>
                              <div><p className="text-sm font-medium">{student.full_name}</p><p className="text-xs text-muted-foreground">{student.email}</p></div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeStudentFromBatch(student.student_id)}>
                              <Trash2 className="h-4 w-4 mr-1" />Remove
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History - Date-wise cards */}
              <TabsContent value="history">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-lg flex items-center gap-2"><History className="h-5 w-5 text-primary" />Attendance History</CardTitle>
                      <div className="flex gap-2 items-center">
                        <Select value={historyMonth} onValueChange={setHistoryMonth}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>{Array.from({ length: 12 }, (_, i) => i + 1).map(m => (<SelectItem key={m} value={String(m).padStart(2, "0")}>{format(new Date(2024, m - 1), "MMMM")}</SelectItem>))}</SelectContent>
                        </Select>
                        <Select value={historyYear} onValueChange={setHistoryYear}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>{["2024", "2025", "2026"].map(y => (<SelectItem key={y} value={y}>{y}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(attendanceHistory).length === 0 ? (
                      <div className="text-center py-16"><History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground font-medium">No records found</p><p className="text-sm text-muted-foreground/70 mt-1">Try selecting a different month or year</p></div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(attendanceHistory).sort(([a], [b]) => b.localeCompare(a)).map(([date, records]) => {
                          const dP = records.filter((r: any) => r.status === "present").length;
                          const dA = records.filter((r: any) => r.status === "absent").length;
                          const dL = records.filter((r: any) => r.status === "late").length;
                          const dT = records.length;
                          const dPct = dT > 0 ? Math.round((dP / dT) * 100) : 0;
                          const isEditing = editingDate === date;
                          return (
                            <motion.div key={date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border-2 overflow-hidden">
                              <div className="flex items-center justify-between p-4 bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div>
                                  <div>
                                    <p className="font-semibold">{date}</p>
                                    <div className="flex gap-2 mt-0.5">
                                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">{dP} present</span>
                                      <span className="text-[10px] font-semibold bg-red-100 text-red-700 rounded-full px-2 py-0.5">{dA} absent</span>
                                      <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">{dL} late</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right"><p className="text-xs text-muted-foreground">Attendance</p><p className={`text-lg font-bold ${dPct >= 75 ? "text-emerald-600" : dPct >= 50 ? "text-amber-600" : "text-red-600"}`}>{dPct}%</p></div>
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => saveEditedAttendance(date)} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">{loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Save className="h-3 w-3 mr-1" />Save</>}</Button>
                                      <Button size="sm" variant="outline" onClick={() => setEditingDate(null)}>Cancel</Button>
                                    </div>
                                  ) : (
                                    <Button size="sm" variant="outline" onClick={() => startEditing(date, records)}><Edit2 className="h-3 w-3 mr-1" />Edit</Button>
                                  )}
                                </div>
                              </div>
                              <div className="p-4 space-y-2">
                                {records.map((r: any) => (
                                  <div key={r.student_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{(r.full_name || "U").charAt(0).toUpperCase()}</div>
                                      <p className="text-sm font-medium">{r.full_name || "Unknown"}</p>
                                    </div>
                                    {isEditing ? (
                                      <div className="flex gap-1.5">{["present", "absent", "late"].map(s => (<StatusPill key={s} status={s} selected={editStatuses[r.student_id] === s} onClick={() => setEditStatuses(prev => ({ ...prev, [r.student_id]: s }))} />))}</div>
                                    ) : (<StatusPill status={r.status} selected={true} onClick={() => {}} />)}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-2">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4"><BookOpen className="h-10 w-10 text-muted-foreground/40" /></div>
                <p className="text-lg font-semibold text-muted-foreground">Select a batch to get started</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Choose a batch from the sidebar to manage attendance</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
