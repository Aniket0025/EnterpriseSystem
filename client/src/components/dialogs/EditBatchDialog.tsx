import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Props { 
  batch: any;
  onSuccess?: () => void; 
}

export function EditBatchDialog({ batch, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<{ _id: string; name: string }[]>([]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  const [form, setForm] = useState({ 
    name: batch.name || "", 
    course: batch.course || "", 
    trainer_id: batch.trainer_id?._id || batch.trainer_id || "", 
    start_date: formatDate(batch.start_date), 
    end_date: formatDate(batch.end_date), 
    max_students: batch.max_students || 30, 
    description: batch.description || "", 
    class_timing: batch.class_timing || "", 
    days: batch.days || "" 
  });

  const getDynamicStatus = () => {
    if (!form.start_date) return "Upcoming";
    const now = new Date();
    const start = new Date(form.start_date);
    const end = form.end_date ? new Date(form.end_date) : null;
    if (now >= start && (!end || now <= end)) return "Active";
    if (end && now > end) return "Completed";
    return "Upcoming";
  };
  
  useEffect(() => {
    if (open) {
      fetch(`${API_URL}/trainers`)
        .then(res => res.json())
        .then(data => setTrainers(data || []))
        .catch(err => console.error(err));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/batches/${batch._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: "Batch updated successfully!" });
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Batch</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Batch Name *</Label>
            <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Course *</Label>
            <Input required value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Trainer</Label>
            <Select value={form.trainer_id} onValueChange={v => setForm({ ...form, trainer_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select trainer" /></SelectTrigger>
              <SelectContent>
                {trainers.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input type="date" required value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Batch Description</Label>
            <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Intensive DSA preparation course" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Class Timing</Label>
              <Input value={form.class_timing} onChange={e => setForm({ ...form, class_timing: e.target.value })} placeholder="e.g. 7:00 PM - 9:00 PM" />
            </div>
            <div className="space-y-2">
              <Label>Days</Label>
              <Input value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} placeholder="e.g. Mon-Fri" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-2">
               <Label>Max Students</Label>
               <Input type="number" min={1} value={form.max_students} onChange={e => setForm({ ...form, max_students: parseInt(e.target.value) || 30 })} />
             </div>
             <div className="space-y-2">
               <Label>Status (Auto)</Label>
               <Input disabled value={getDynamicStatus()} className="bg-muted capitalize" />
             </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
