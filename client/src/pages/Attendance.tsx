import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Clock, LogIn, LogOut, Calendar, CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { Input } from "@/components/ui/input";

interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

export default function Attendance() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const isAdmin = role === "super_admin" || role === "hr_admin";
  const isTrainer = role === "trainer";
  const isStudent = role === "student";

  // Employee self-attendance
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Trainer: batch attendance
  const [trainerBatches, setTrainerBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batchStudents, setBatchStudents] = useState<any[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [studentStatuses, setStudentStatuses] = useState<Record<string, string>>({});
  const [existingAttendance, setExistingAttendance] = useState<any[]>([]);

  // Student: view by batch
  const [studentBatches, setStudentBatches] = useState<any[]>([]);
  const [selectedStudentBatch, setSelectedStudentBatch] = useState("");
  const [studentAttendance, setStudentAttendance] = useState<any[]>([]);

  // Employee self-attendance
  const fetchSelfAttendance = async () => {
    if (!user) return;
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    const query = supabase.from("attendance").select("*").gte("date", start).lte("date", end).order("date", { ascending: false });
    if (!isAdmin) query.eq("user_id", user.id);
    const { data } = await query;
    setRecords(data || []);
    const today = format(new Date(), "yyyy-MM-dd");
    setTodayRecord((data || []).find(r => r.date === today && r.user_id === user.id) || null);
  };

  // Trainer: fetch batches
  const fetchTrainerBatches = async () => {
    if (!user) return;
    const { data: trainerData } = await supabase.from("trainers").select("id").eq("user_id", user.id).single();
    if (!trainerData) return;
    const { data } = await supabase.from("batches").select("*").eq("trainer_id", trainerData.id).eq("status", "active");
    setTrainerBatches(data || []);
    if (data && data.length > 0 && !selectedBatch) setSelectedBatch(data[0].id);
  };

  // Trainer: fetch students in batch
  const fetchBatchStudents = async () => {
    if (!selectedBatch) return;
    const { data: enrollments } = await supabase.from("batch_students").select("user_id").eq("batch_id", selectedBatch).eq("status", "active");
    if (!enrollments?.length) { setBatchStudents([]); return; }
    const userIds = enrollments.map(e => e.user_id);
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
    setBatchStudents(profiles || []);

    // Fetch existing attendance for this date
    const { data: existing } = await supabase.from("student_attendance").select("*").eq("batch_id", selectedBatch).eq("date", attendanceDate);
    setExistingAttendance(existing || []);
    const statuses: Record<string, string> = {};
    (existing || []).forEach(a => { statuses[a.student_id] = a.status; });
    (profiles || []).forEach(p => { if (!statuses[p.user_id]) statuses[p.user_id] = "present"; });
    setStudentStatuses(statuses);
  };

  // Student: fetch enrolled batches
  const fetchStudentBatches = async () => {
    if (!user) return;
    const { data: enrollments } = await supabase.from("batch_students").select("batch_id").eq("user_id", user.id);
    if (!enrollments?.length) return;
    const batchIds = enrollments.map(e => e.batch_id);
    const { data } = await supabase.from("batches").select("*").in("id", batchIds);
    setStudentBatches(data || []);
    if (data && data.length > 0 && !selectedStudentBatch) setSelectedStudentBatch(data[0].id);
  };

  // Student: fetch attendance for batch
  const fetchStudentAttendance = async () => {
    if (!user || !selectedStudentBatch) return;
    const { data } = await supabase.from("student_attendance").select("*").eq("batch_id", selectedStudentBatch).eq("student_id", user.id).order("date", { ascending: false });
    setStudentAttendance(data || []);
  };

  useEffect(() => {
    if (isTrainer) fetchTrainerBatches();
    else if (isStudent) fetchStudentBatches();
    else fetchSelfAttendance();
  }, [user, currentMonth]);

  useEffect(() => { if (isTrainer && selectedBatch) fetchBatchStudents(); }, [selectedBatch, attendanceDate]);
  useEffect(() => { if (isStudent && selectedStudentBatch) fetchStudentAttendance(); }, [selectedStudentBatch]);

  const handleCheckIn = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const now = new Date();
      const status = now.getHours() > 9 ? "late" : "present";
      const { error } = await supabase.from("attendance").insert({ user_id: user.id, date: format(now, "yyyy-MM-dd"), check_in: now.toISOString(), status });
      if (error) throw error;
      toast({ title: "Checked in!", description: `Status: ${status}` });
      fetchSelfAttendance();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleCheckOut = async () => {
    if (!user || !todayRecord) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("attendance").update({ check_out: new Date().toISOString() }).eq("id", todayRecord.id);
      if (error) throw error;
      toast({ title: "Checked out!" });
      fetchSelfAttendance();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleSaveBatchAttendance = async () => {
    if (!user || !selectedBatch) return;
    setLoading(true);
    try {
      // Upsert attendance for each student
      const rows = Object.entries(studentStatuses).map(([student_id, status]) => ({
        batch_id: selectedBatch,
        student_id,
        date: attendanceDate,
        status,
        marked_by: user.id,
      }));

      // Delete existing and re-insert
      await supabase.from("student_attendance").delete().eq("batch_id", selectedBatch).eq("date", attendanceDate);
      const { error } = await supabase.from("student_attendance").insert(rows);
      if (error) throw error;
      toast({ title: "Attendance saved!", description: `Marked for ${rows.length} students` });
      fetchBatchStudents();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  // Trainer view
  if (isTrainer) {
    return (
      <div>
        <PageHeader title="Batch Attendance" description="Mark attendance for students in your batches" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5" />Select Batch & Date</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    {trainerBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name} — {b.course}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
                {trainerBatches.length === 0 && <p className="text-sm text-muted-foreground">No active batches assigned to you.</p>}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mark Attendance — {attendanceDate}</CardTitle>
              </CardHeader>
              <CardContent>
                {batchStudents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No students enrolled in this batch.</p>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">Student</th>
                            <th className="text-left py-2 px-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchStudents.map(student => (
                            <tr key={student.user_id} className="border-b last:border-0">
                              <td className="py-3 px-3 font-medium">{student.full_name || "Unnamed"}</td>
                              <td className="py-3 px-3">
                                <div className="flex gap-2">
                                  {["present", "absent", "late"].map(status => (
                                    <Button
                                      key={status}
                                      size="sm"
                                      variant={studentStatuses[student.user_id] === status ? "default" : "outline"}
                                      className={`capitalize text-xs ${
                                        studentStatuses[student.user_id] === status
                                          ? status === "present" ? "bg-green-600 hover:bg-green-700" : status === "absent" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
                                          : ""
                                      }`}
                                      onClick={() => setStudentStatuses(prev => ({ ...prev, [student.user_id]: status }))}
                                    >
                                      {status}
                                    </Button>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button className="w-full mt-4" onClick={handleSaveBatchAttendance} disabled={loading}>
                      {loading ? "Saving..." : "Save Attendance"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Student view
  if (isStudent) {
    const presentDays = studentAttendance.filter(a => a.status === "present").length;
    const absentDays = studentAttendance.filter(a => a.status === "absent").length;
    const lateDays = studentAttendance.filter(a => a.status === "late").length;
    const total = studentAttendance.length;

    return (
      <div>
        <PageHeader title="My Attendance" description="View your attendance records by batch" />
        <div className="mb-6">
          <Select value={selectedStudentBatch} onValueChange={setSelectedStudentBatch}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Select batch" /></SelectTrigger>
            <SelectContent>
              {studentBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name} — {b.course}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCardInline title="Present" value={presentDays} icon={CheckCircle} color="text-green-500" />
          <StatsCardInline title="Late" value={lateDays} icon={AlertCircle} color="text-amber-500" />
          <StatsCardInline title="Absent" value={absentDays} icon={XCircle} color="text-red-500" />
          <StatsCardInline title="Attendance %" value={total > 0 ? `${Math.round(((presentDays + lateDays) / total) * 100)}%` : "0%"} icon={Calendar} color="text-primary" />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">Attendance Records</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Date</th>
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAttendance.map(a => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 px-3">{format(new Date(a.date), "MMM d, yyyy")}</td>
                      <td className="py-2 px-3">
                        <Badge variant={a.status === "present" ? "default" : a.status === "absent" ? "destructive" : "secondary"} className="capitalize">{a.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {studentAttendance.length === 0 && (
                    <tr><td colSpan={2} className="text-center py-8 text-muted-foreground">No attendance records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Employee / Admin view (self check-in/out)
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const presentDays = records.filter(r => r.status === "present" && r.user_id === user?.id).length;
  const lateDays = records.filter(r => r.status === "late" && r.user_id === user?.id).length;
  const totalWorkDays = days.filter(d => d <= new Date()).length;
  const absentDays = totalWorkDays - records.filter(r => r.user_id === user?.id).length;

  const getStatusForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return records.find(r => r.date === dateStr && r.user_id === user?.id);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-500";
      case "late": return "bg-amber-500";
      case "absent": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  return (
    <div>
      <PageHeader title="Attendance" description="Track daily attendance with check-in and check-out." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCardInline title="Present Days" value={presentDays} icon={CheckCircle} color="text-green-500" />
        <StatsCardInline title="Late Days" value={lateDays} icon={AlertCircle} color="text-amber-500" />
        <StatsCardInline title="Absent Days" value={Math.max(0, absentDays)} icon={XCircle} color="text-red-500" />
        <StatsCardInline title="Attendance Rate" value={`${totalWorkDays > 0 ? Math.round((presentDays + lateDays) / totalWorkDays * 100) : 0}%`} icon={Calendar} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5" /> Today</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-3xl font-bold">{format(new Date(), "hh:mm a")}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
              </div>
              {todayRecord ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Check In</span>
                    <span className="font-medium text-sm">{todayRecord.check_in ? format(new Date(todayRecord.check_in), "hh:mm a") : "—"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Check Out</span>
                    <span className="font-medium text-sm">{todayRecord.check_out ? format(new Date(todayRecord.check_out), "hh:mm a") : "—"}</span>
                  </div>
                  <Badge variant={todayRecord.status === "present" ? "default" : "secondary"} className="capitalize">{todayRecord.status}</Badge>
                  {!todayRecord.check_out && (
                    <Button className="w-full" variant="destructive" onClick={handleCheckOut} disabled={loading}>
                      <LogOut className="mr-2 h-4 w-4" /> Check Out
                    </Button>
                  )}
                </div>
              ) : (
                <Button className="w-full" onClick={handleCheckIn} disabled={loading}>
                  <LogIn className="mr-2 h-4 w-4" /> Check In
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Monthly Calendar</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>←</Button>
                  <span className="text-sm font-medium px-3 flex items-center">{format(currentMonth, "MMMM yyyy")}</span>
                  <Button size="sm" variant="outline" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>→</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: days[0].getDay() }).map((_, i) => <div key={`e-${i}`} />)}
                {days.map(day => {
                  const rec = getStatusForDay(day);
                  return (
                    <motion.div key={day.toISOString()} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${isToday(day) ? "ring-2 ring-primary" : ""}`} whileHover={{ scale: 1.1 }}>
                      <span className={`font-medium ${isToday(day) ? "text-primary" : ""}`}>{format(day, "d")}</span>
                      {rec && <div className={`h-1.5 w-1.5 rounded-full ${statusColor(rec.status)} mt-0.5`} />}
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                {[{ label: "Present", color: "bg-green-500" }, { label: "Late", color: "bg-amber-500" }, { label: "Absent", color: "bg-red-500" }].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs"><div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />{item.label}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Inline stats card to avoid import issues with the existing StatsCard
function StatsCardInline({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-muted ${color}`}><Icon className="h-5 w-5" /></div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
