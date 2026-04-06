import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Props { onSuccess?: () => void; }

export function AddBatchDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ name: "", course: "", trainer_id: "", start_date: "", end_date: "", max_students: 30 });

  useEffect(() => {
    if (open) {
      fetch("http://localhost:5000/api/trainers")
        .then(res => res.json())
        .then(data => setTrainers(data || []))
        .catch(err => console.error(err));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: "Batch created successfully!" });
      setForm({ name: "", course: "", trainer_id: "", start_date: "", end_date: "", max_students: 30 });
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
        <Button><Plus className="h-4 w-4 mr-2" />New Batch</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create New Batch</DialogTitle></DialogHeader>
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
                {trainers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
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
            <Label>Max Students</Label>
            <Input type="number" min={1} value={form.max_students} onChange={e => setForm({ ...form, max_students: parseInt(e.target.value) || 30 })} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Batch"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
