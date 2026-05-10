import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Props { onSuccess?: () => void; }

export function AddTrainerDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialization: "", experience_years: 0, password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/trainers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: "Trainer added successfully!" });
      setForm({ name: "", email: "", phone: "", specialization: "", experience_years: 0, password: "" });
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
        <Button><Plus className="h-4 w-4 mr-2" />Add Trainer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add New Trainer</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Specialization *</Label>
            <Input required value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Experience (years)</Label>
            <Input type="number" min={0} value={form.experience_years} onChange={e => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <Label>Account Password *</Label>
            <Input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Required for trainer login" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Trainer"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
