import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserPlus, Pencil, Trash2, Search, Loader2, Users, Calendar,
  CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Video, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` };
}

const statusColor = (s: string) =>
  s === "active" ? "bg-emerald-100 text-emerald-700" :
  s === "completed" ? "bg-blue-100 text-blue-700" :
  "bg-red-100 text-red-700";

const meetStatusColor = (s: string) =>
  s === "present" ? "bg-emerald-100 text-emerald-700" :
  s === "late" ? "bg-amber-100 text-amber-700" :
  "bg-red-100 text-red-700";

const meetStatusIcon = (s: string) =>
  s === "present" ? CheckCircle2 :
  s === "late" ? Clock :
  XCircle;

const emptyForm = { full_name: "", email: "", password: "", phone: "", address: "", department: "", university: "", internship_start: "", internship_end: "", mentor: "", status: "active" };

// ===== ADD INTERN DIALOG =====
function AddInternDialog({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (v: boolean) => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => { if (open) setForm({ ...emptyForm }); }, [open]);

  const handleSave = async () => {
    if (!form.full_name || !form.email) return toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/interns`, { method: "POST", headers: getHeaders(), body: JSON.stringify(form) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Failed"); }
      toast({ title: "Intern Added", description: `${form.full_name} added successfully` });
      onOpenChange(false);
      onSuccess();
    } catch (err: any) { toast({ title: "Error", description: err.message || "Failed to add intern", variant: "destructive" }); }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Add New Intern</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Full Name *</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" /></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" /></div>
          </div>
          <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Default: intern123" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Department</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>University</Label><Input value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} /></div>
            <div><Label>Mentor</Label><Input value={form.mentor} onChange={e => setForm({ ...form, mentor: e.target.value })} /></div>
          </div>
          <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start Date</Label><Input type="date" value={form.internship_start} onChange={e => setForm({ ...form, internship_start: e.target.value })} /></div>
            <div><Label>End Date</Label><Input type="date" value={form.internship_end} onChange={e => setForm({ ...form, internship_end: e.target.value })} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Intern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== EDIT INTERN DIALOG =====
function EditInternDialog({ open, onOpenChange, intern, onSuccess }: { open: boolean; onOpenChange: (v: boolean) => void; intern: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (open && intern) {
      setForm({
        full_name: intern.full_name || "", email: intern.email || "", password: "", phone: intern.phone || "",
        address: intern.address || "", department: intern.department || "", university: intern.university || "",
        internship_start: intern.internship_start ? new Date(intern.internship_start).toISOString().split("T")[0] : "",
        internship_end: intern.internship_end ? new Date(intern.internship_end).toISOString().split("T")[0] : "",
        mentor: intern.mentor || "", status: intern.status || "active"
      });
    }
  }, [open, intern]);

  const handleSave = async () => {
    if (!form.full_name || !form.email) return toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
    setSaving(true);
    try {
      const body = { full_name: form.full_name, email: form.email, phone: form.phone, address: form.address, department: form.department, university: form.university, internship_start: form.internship_start, internship_end: form.internship_end, mentor: form.mentor, status: form.status };
      const res = await fetch(`${API_URL}/interns/${intern._id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast({ title: "Intern Updated", description: `${form.full_name} updated successfully` });
      onOpenChange(false);
      onSuccess();
    } catch { toast({ title: "Error", description: "Failed to update intern", variant: "destructive" }); }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Pencil className="h-5 w-5" />Edit Intern</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Full Name *</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Department</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>University</Label><Input value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} /></div>
            <div><Label>Mentor</Label><Input value={form.mentor} onChange={e => setForm({ ...form, mentor: e.target.value })} /></div>
          </div>
          <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start Date</Label><Input type="date" value={form.internship_start} onChange={e => setForm({ ...form, internship_start: e.target.value })} /></div>
            <div><Label>End Date</Label><Input type="date" value={form.internship_end} onChange={e => setForm({ ...form, internship_end: e.target.value })} /></div>
          </div>
          <div><Label>Status</Label>
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="terminated">Terminated</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== SCHEDULE MEETING DIALOG =====
function ScheduleMeetingDialog({ open, onOpenChange, intern, onSuccess }: { open: boolean; onOpenChange: (v: boolean) => void; intern: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ meeting_title: "", meeting_date: "", meeting_time: "", meeting_link: "", description: "" });

  useEffect(() => {
    if (open) setForm({ meeting_title: "", meeting_date: new Date().toISOString().split("T")[0], meeting_time: "10:00", meeting_link: "", description: "" });
  }, [open]);

  const handleSchedule = async () => {
    if (!form.meeting_title || !form.meeting_date) return toast({ title: "Error", description: "Title and date are required", variant: "destructive" });
    setSaving(true);
    try {
      const meetingDateTime = form.meeting_time ? `${form.meeting_date}T${form.meeting_time}` : form.meeting_date;
      const res = await fetch(`${API_URL}/interns/${intern._id}/meetings`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify({ ...form, meeting_date: meetingDateTime })
      });
      if (!res.ok) throw new Error();
      toast({ title: "Meeting Scheduled", description: `"${form.meeting_title}" scheduled for ${intern.full_name}` });
      onOpenChange(false);
      onSuccess();
    } catch { toast({ title: "Error", description: "Failed to schedule meeting", variant: "destructive" }); }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Video className="h-5 w-5" />Schedule Meeting — {intern?.full_name}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Meeting Title *</Label><Input value={form.meeting_title} onChange={e => setForm({ ...form, meeting_title: e.target.value })} placeholder="e.g. Weekly Standup" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Date *</Label><Input type="date" value={form.meeting_date} onChange={e => setForm({ ...form, meeting_date: e.target.value })} /></div>
            <div><Label>Time</Label><Input type="time" value={form.meeting_time} onChange={e => setForm({ ...form, meeting_time: e.target.value })} /></div>
          </div>
          <div><Label>Meeting Link</Label><Input value={form.meeting_link} onChange={e => setForm({ ...form, meeting_link: e.target.value })} placeholder="https://meet.google.com/..." /></div>
          <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional meeting description" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSchedule} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Schedule Meeting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== ATTENDANCE DIALOG =====
function AttendanceDialog({ open, onOpenChange, intern, onSuccess }: { open: boolean; onOpenChange: (v: boolean) => void; intern: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ meeting_title: "", meeting_date: new Date().toISOString().split("T")[0], status: "present", notes: "" });
  const [meetingHistory, setMeetingHistory] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1));
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));
  const [activeFilter, setActiveFilter] = useState<"month" | "date">("month");

  const fetchHistory = useCallback(async () => {
    if (!intern) return;
    try {
      const res = await fetch(`${API_URL}/interns/${intern._id}/meeting-attendance`, { headers: getHeaders() });
      const data = await res.json();
      setMeetingHistory(data || []);
    } catch { setMeetingHistory([]); }
  }, [intern]);

  useEffect(() => { if (open) { fetchHistory(); setMeetingForm({ meeting_title: "", meeting_date: new Date().toISOString().split("T")[0], status: "present", notes: "" }); } }, [open, fetchHistory]);

  const handleMarkAttendance = async () => {
    if (!meetingForm.meeting_title || !meetingForm.meeting_date) return toast({ title: "Error", description: "Meeting title and date required", variant: "destructive" });
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/interns/${intern._id}/meeting-attendance`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify(meetingForm)
      });
      if (!res.ok) throw new Error();
      toast({ title: "Attendance Marked", description: `Marked ${meetingForm.status} for ${intern.full_name}` });
      setMeetingForm({ meeting_title: "", meeting_date: new Date().toISOString().split("T")[0], status: "present", notes: "" });
      fetchHistory();
      onSuccess();
    } catch { toast({ title: "Error", description: "Failed to mark attendance", variant: "destructive" }); }
    setSaving(false);
  };

  const filteredHistory = meetingHistory.filter((m: any) => {
    if (activeFilter === "date" && filterDate) {
      return new Date(m.meeting_date).toISOString().split("T")[0] === filterDate;
    }
    if (activeFilter === "month") {
      const d = new Date(m.meeting_date);
      return d.getMonth() + 1 === parseInt(filterMonth) && d.getFullYear() === parseInt(filterYear);
    }
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Meeting Attendance — {intern?.full_name}</DialogTitle></DialogHeader>

        {/* Mark New Attendance */}
        <Card className="border-dashed border-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4" />Mark Manual Attendance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Meeting Title *</Label><Input value={meetingForm.meeting_title} onChange={e => setMeetingForm({ ...meetingForm, meeting_title: e.target.value })} placeholder="e.g. Weekly Standup" /></div>
              <div><Label>Date *</Label><Input type="date" value={meetingForm.meeting_date} onChange={e => setMeetingForm({ ...meetingForm, meeting_date: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Status</Label>
                <Select value={meetingForm.status} onValueChange={v => setMeetingForm({ ...meetingForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="present">Present</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="absent">Absent</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Notes</Label><Input value={meetingForm.notes} onChange={e => setMeetingForm({ ...meetingForm, notes: e.target.value })} placeholder="Optional" /></div>
            </div>
            <Button onClick={handleMarkAttendance} disabled={saving} size="sm">{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Mark Attendance</Button>
          </CardContent>
        </Card>

        {/* History with Filters */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Attendance History ({filteredHistory.length} of {meetingHistory.length})</h4>
            <Tabs value={activeFilter} onValueChange={v => setActiveFilter(v as "month" | "date")} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="month" className="text-xs px-3">By Month</TabsTrigger>
                <TabsTrigger value="date" className="text-xs px-3">By Date</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeFilter === "month" ? (
            <div className="flex gap-2 mb-3">
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-[90px]" placeholder="Year" />
            </div>
          ) : (
            <div className="mb-3"><Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-[180px]" placeholder="Select date" /></div>
          )}

          {filteredHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 text-sm">No meetings found for this filter.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {[...filteredHistory].reverse().map((m: any, i: number) => {
                const Icon = meetStatusIcon(m.status);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border text-sm">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${m.status === "present" ? "text-emerald-600" : m.status === "late" ? "text-amber-600" : "text-red-600"}`} />
                      <div>
                        <p className="font-medium">{m.meeting_title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(m.meeting_date).toLocaleDateString()} {m.notes && `• ${m.notes}`}</p>
                      </div>
                    </div>
                    <Badge className={meetStatusColor(m.status)}>{m.status}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ===== BULK ATTENDANCE DIALOG =====
function BulkAttendanceDialog({ open, onOpenChange, interns, onSuccess }: { open: boolean; onOpenChange: (v: boolean) => void; interns: any[]; onSuccess: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [bulkForm, setBulkForm] = useState({ meeting_title: "", meeting_date: new Date().toISOString().split("T")[0] });
  const [bulkRecords, setBulkRecords] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setBulkForm({ meeting_title: "", meeting_date: new Date().toISOString().split("T")[0] });
      setBulkRecords(interns.filter(i => i.status === "active").map(i => ({ internId: i._id, full_name: i.full_name, status: "present", notes: "" })));
    }
  }, [open, interns]);

  const handleBulkSave = async () => {
    if (!bulkForm.meeting_title || !bulkForm.meeting_date) return toast({ title: "Error", description: "Meeting title and date required", variant: "destructive" });
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/interns/meeting-attendance/bulk`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify({ ...bulkForm, records: bulkRecords.map(r => ({ internId: r.internId, status: r.status, notes: r.notes })) })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast({ title: "Bulk Attendance Marked", description: `Marked for ${data.count} interns` });
      onOpenChange(false);
      onSuccess();
    } catch { toast({ title: "Error", description: "Failed to mark bulk attendance", variant: "destructive" }); }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Bulk Meeting Attendance</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Meeting Title *</Label><Input value={bulkForm.meeting_title} onChange={e => setBulkForm({ ...bulkForm, meeting_title: e.target.value })} placeholder="e.g. Weekly Standup" /></div>
            <div><Label>Date *</Label><Input type="date" value={bulkForm.meeting_date} onChange={e => setBulkForm({ ...bulkForm, meeting_date: e.target.value })} /></div>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {bulkRecords.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm font-medium">{r.full_name}</span>
                <div className="flex gap-1">
                  {["present", "late", "absent"].map(s => (
                    <Button key={s} variant={r.status === s ? "default" : "outline"} size="sm" onClick={() => {
                      const updated = [...bulkRecords]; updated[i] = { ...updated[i], status: s }; setBulkRecords(updated);
                    }}>{s.charAt(0).toUpperCase() + s.slice(1)}</Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={handleBulkSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Mark for All</Button></DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ===== MAIN INTERNS PAGE =====
export default function Interns() {
  const { toast } = useToast();
  const { role } = useAuth();
  const isHR = role === "super_admin" || role === "hr_admin";

  const [interns, setInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [showBulkAttendance, setShowBulkAttendance] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<any>(null);
  const [expandedIntern, setExpandedIntern] = useState<string | null>(null);

  const fetchInterns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/interns`, { headers: getHeaders() });
      const data = await res.json();
      setInterns(data);
    } catch { toast({ title: "Error", description: "Failed to load interns", variant: "destructive" }); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchInterns(); }, [fetchInterns]);

  const filtered = interns.filter(i => {
    const matchSearch = i.full_name?.toLowerCase().includes(search.toLowerCase()) || i.email?.toLowerCase().includes(search.toLowerCase()) || i.department?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this intern?")) return;
    try {
      await fetch(`${API_URL}/interns/${id}`, { method: "DELETE", headers: getHeaders() });
      toast({ title: "Deleted", description: "Intern removed successfully" });
      fetchInterns();
    } catch { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); }
  };

  if (!isHR) {
    return <div className="flex h-[80vh] items-center justify-center"><p className="text-muted-foreground text-lg">Access Restricted</p></div>;
  }

  return (
    <div>
      <PageHeader title="Interns" description="Manage interns, schedule meetings, and track attendance" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Interns", value: interns.length, icon: Users, color: "border-l-blue-500" },
          { label: "Active", value: interns.filter(i => i.status === "active").length, icon: CheckCircle2, color: "border-l-emerald-500" },
          { label: "Completed", value: interns.filter(i => i.status === "completed").length, icon: Clock, color: "border-l-amber-500" },
          { label: "Terminated", value: interns.filter(i => i.status === "terminated").length, icon: XCircle, color: "border-l-red-500" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-l-4 ${s.color}`}><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><s.icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search interns..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="terminated">Terminated</SelectItem></SelectContent>
        </Select>
        <Button onClick={() => setShowBulkAttendance(true)} variant="outline"><Calendar className="mr-2 h-4 w-4" />Bulk Attendance</Button>
        <Button onClick={() => setShowAdd(true)}><UserPlus className="mr-2 h-4 w-4" />Add Intern</Button>
      </div>

      {/* Intern List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20"><Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No interns found.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((intern, idx) => {
            const isExpanded = expandedIntern === intern._id;
            const pct = intern.totalMeetings > 0 ? Math.round(((intern.presentMeetings || 0) / intern.totalMeetings) * 100) : 0;
            return (
              <motion.div key={intern._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">{intern.full_name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{intern.full_name}</p>
                          <p className="text-xs text-muted-foreground">{intern.email} {intern.department && `• ${intern.department}`}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge className={statusColor(intern.status)}>{intern.status}</Badge>
                        {intern.totalMeetings > 0 && <span className="text-xs text-muted-foreground mr-1">{pct}%</span>}
                        <Button variant="ghost" size="sm" title="Schedule Meeting" onClick={() => { setSelectedIntern(intern); setShowScheduleMeeting(true); }}><Video className="h-4 w-4 text-blue-500" /></Button>
                        <Button variant="ghost" size="sm" title="Attendance" onClick={() => { setSelectedIntern(intern); setShowAttendance(true); }}><Calendar className="h-4 w-4 text-emerald-500" /></Button>
                        <Button variant="ghost" size="sm" title="Edit" onClick={() => { setSelectedIntern(intern); setShowEdit(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" title="Delete" onClick={() => handleDelete(intern._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedIntern(isExpanded ? null : intern._id)}>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            {intern.university && <div><p className="text-muted-foreground text-xs">University</p><p className="font-medium">{intern.university}</p></div>}
                            {intern.mentor && <div><p className="text-muted-foreground text-xs">Mentor</p><p className="font-medium">{intern.mentor}</p></div>}
                            {intern.internship_start && <div><p className="text-muted-foreground text-xs">Start</p><p className="font-medium">{new Date(intern.internship_start).toLocaleDateString()}</p></div>}
                            {intern.internship_end && <div><p className="text-muted-foreground text-xs">End</p><p className="font-medium">{new Date(intern.internship_end).toLocaleDateString()}</p></div>}
                            {intern.phone && <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{intern.phone}</p></div>}
                            <div><p className="text-muted-foreground text-xs">Meetings</p><p className="font-medium">{intern.totalMeetings || 0} total • {intern.presentMeetings || 0} present</p></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <AddInternDialog open={showAdd} onOpenChange={setShowAdd} onSuccess={fetchInterns} />
      <EditInternDialog open={showEdit} onOpenChange={setShowEdit} intern={selectedIntern} onSuccess={fetchInterns} />
      <ScheduleMeetingDialog open={showScheduleMeeting} onOpenChange={setShowScheduleMeeting} intern={selectedIntern} onSuccess={fetchInterns} />
      <AttendanceDialog open={showAttendance} onOpenChange={setShowAttendance} intern={selectedIntern} onSuccess={fetchInterns} />
      <BulkAttendanceDialog open={showBulkAttendance} onOpenChange={setShowBulkAttendance} interns={interns} onSuccess={fetchInterns} />
    </div>
  );
}
