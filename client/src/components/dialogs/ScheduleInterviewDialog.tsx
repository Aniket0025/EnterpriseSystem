import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Props { onSuccess?: () => void; }

export function ScheduleInterviewDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<{ _id: string; candidate_name: string; position: string; status: string }[]>([]);
  const [form, setForm] = useState({ recruitment_id: "", scheduled_at: "", meeting_link: "" });

  useEffect(() => {
    if (open) {
      fetch(`${API_URL}/candidates`)
        .then((res) => res.json())
        .then((data) => {
          // Filter to show only candidates that are applied, shortlisted, or interview
          const validCandidates = (data || []).filter((c: any) => 
            ['applied', 'shortlisted', 'interview'].includes(c.status)
          );
          setCandidates(validCandidates);
        })
        .catch((err) => console.error("Error fetching candidates:", err));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/interviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruitment_id: form.recruitment_id,
          scheduled_at: new Date(form.scheduled_at).toISOString(),
          meeting_link: form.meeting_link || null,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to schedule interview");
      }

      toast({ title: "Interview scheduled!" });
      setForm({ recruitment_id: "", scheduled_at: "", meeting_link: "" });
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
        <Button><Plus className="h-4 w-4 mr-2" />Schedule Interview</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Candidate *</Label>
            <Select value={form.recruitment_id} onValueChange={v => setForm({ ...form, recruitment_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select candidate" /></SelectTrigger>
              <SelectContent>
                {candidates.map(c => <SelectItem key={c._id} value={c._id}>{c.candidate_name} — {c.position} ({c.status})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date & Time *</Label>
            <Input type="datetime-local" required value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Meeting Link</Label>
            <Input value={form.meeting_link} onChange={e => setForm({ ...form, meeting_link: e.target.value })} placeholder="https://meet.google.com/..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Scheduling..." : "Schedule Interview"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
