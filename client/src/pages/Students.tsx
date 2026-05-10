import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { UserPlus, Pencil, Trash2, Coins, History, Search, Loader2, GraduationCap, Users } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Students() {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Add/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "", address: "", credits: "0", status: "active" });
  const [saving, setSaving] = useState(false);

  // Credit dialog
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditStudentId, setCreditStudentId] = useState("");
  const [creditForm, setCreditForm] = useState({ amount: "", type: "add", reason: "" });
  const [creditSaving, setCreditSaving] = useState(false);

  // Credit history dialog
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [creditHistory, setCreditHistory] = useState<any>(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filteredStudents = students.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone?.includes(searchQuery)
  );

  // Open add dialog
  const openAdd = () => {
    setEditMode(false);
    setEditId("");
    setForm({ full_name: "", email: "", password: "", phone: "", address: "", credits: "0", status: "active" });
    setDialogOpen(true);
  };

  // Open edit dialog
  const openEdit = (s: any) => {
    setEditMode(true);
    setEditId(s._id);
    setForm({ full_name: s.full_name, email: s.email, password: "", phone: s.phone || "", address: s.address || "", credits: String(s.credits || 0), status: s.status });
    setDialogOpen(true);
  };

  // Save student (add or edit)
  const handleSave = async () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      toast({ title: "Name and email are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const url = editMode ? `${API_URL}/students/${editId}` : `${API_URL}/students`;
      const method = editMode ? "PUT" : "POST";
      const body: any = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        status: form.status
      };
      if (!editMode) {
        body.password = form.password || "student123";
        body.credits = parseInt(form.credits) || 0;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: editMode ? "Student updated" : "Student created" });
      setDialogOpen(false);
      fetchStudents();
    } catch (err: any) {
      toast({ title: err.message || "Error saving student", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Delete student
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/students/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Student deleted" });
      setDeleteDialogOpen(false);
      fetchStudents();
    } catch (err: any) {
      toast({ title: err.message || "Error deleting student", variant: "destructive" });
    }
  };

  // Manage credits
  const handleCreditSave = async () => {
    if (!creditForm.amount || parseInt(creditForm.amount) <= 0) {
      toast({ title: "Valid amount required", variant: "destructive" });
      return;
    }
    setCreditSaving(true);
    try {
      const res = await fetch(`${API_URL}/students/${creditStudentId}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: parseInt(creditForm.amount),
          type: creditForm.type,
          reason: creditForm.reason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: creditForm.type === "add" ? "Credits added" : "Credits deducted" });
      setCreditDialogOpen(false);
      setCreditForm({ amount: "", type: "add", reason: "" });
      fetchStudents();
    } catch (err: any) {
      toast({ title: err.message || "Error managing credits", variant: "destructive" });
    } finally {
      setCreditSaving(false);
    }
  };

  // Fetch credit history
  const fetchCreditHistory = async (studentId: string) => {
    try {
      const res = await fetch(`${API_URL}/students/${studentId}/credits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCreditHistory(data);
      setHistoryDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "inactive": return "bg-red-100 text-red-700";
      case "graduated": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const totalCredits = students.reduce((sum, s) => sum + (s.credits || 0), 0);
  const activeCount = students.filter(s => s.status === "active").length;

  return (
    <div>
      <PageHeader
        title="Students"
        description="Manage student records, profiles, and credits"
        action={
          <Button onClick={openAdd}><UserPlus className="h-4 w-4 mr-2" />Add Student</Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted text-primary"><Users className="h-5 w-5" /></div>
            <div><p className="text-sm text-muted-foreground">Total Students</p><p className="text-xl font-bold">{students.length}</p></div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted text-green-600"><GraduationCap className="h-5 w-5" /></div>
            <div><p className="text-sm text-muted-foreground">Active</p><p className="text-xl font-bold">{activeCount}</p></div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted text-amber-600"><Coins className="h-5 w-5" /></div>
            <div><p className="text-sm text-muted-foreground">Total Credits</p><p className="text-xl font-bold">{totalCredits}</p></div>
          </CardContent></Card>
        </motion.div>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 font-medium">Credits</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={s._id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium">{s.full_name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.email}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.phone || "—"}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Coins className="h-3.5 w-3.5" />{s.credits || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`capitalize ${statusColor(s.status)}`}>{s.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setCreditStudentId(s._id); setCreditDialogOpen(true); }} title="Manage Credits">
                          <Coins className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fetchCreditHistory(s._id)} title="Credit History">
                          <History className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setDeleteId(s._id); setDeleteDialogOpen(true); }} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">
                    {students.length === 0 ? "No students yet. Click 'Add Student' to get started." : "No students match your search."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Enter full name" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />
            </div>
            {!editMode && (
              <div>
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Default: student123" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
              </div>
              {!editMode ? (
                <div>
                  <Label>Initial Credits</Label>
                  <Input type="number" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} placeholder="0" />
                </div>
              ) : (
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div>
              <Label>Address</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Address" />
            </div>
            {!editMode && (
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editMode ? "Update Student" : "Create Student"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Management Dialog */}
      <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Manage Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={creditForm.type} onValueChange={v => setCreditForm({ ...creditForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Credits</SelectItem>
                  <SelectItem value="deduct">Deduct Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={creditForm.amount} onChange={e => setCreditForm({ ...creditForm, amount: e.target.value })} placeholder="Enter amount" />
            </div>
            <div>
              <Label>Reason</Label>
              <Input value={creditForm.reason} onChange={e => setCreditForm({ ...creditForm, reason: e.target.value })} placeholder="Reason for credit change" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className={`flex-1 ${creditForm.type === "add" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`} onClick={handleCreditSave} disabled={creditSaving}>
                {creditSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</> : creditForm.type === "add" ? "Add Credits" : "Deduct Credits"}
              </Button>
              <Button variant="outline" onClick={() => setCreditDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Credit History</DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
              <Coins className="h-5 w-5 text-amber-600" />
              <span className="font-semibold">Current Balance: {creditHistory?.credits || 0} credits</span>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {(creditHistory?.history || []).length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No credit history yet.</p>
              ) : (
                (creditHistory?.history || []).slice().reverse().map((h: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{h.reason || (h.type === "add" ? "Credit Added" : "Credit Deducted")}</p>
                      <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-bold text-sm ${h.type === "add" ? "text-green-600" : "text-red-600"}`}>
                      {h.type === "add" ? "+" : "-"}{h.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this student? This action cannot be undone. The student's user account will also be removed.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>Delete</Button>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
