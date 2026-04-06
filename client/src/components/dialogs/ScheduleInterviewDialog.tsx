import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface Props { onSuccess?: () => void; }

export function ScheduleInterviewDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<{ id: string; candidate_name: string; position: string }[]>([]);
  const [form, setForm] = useState({ recruitment_id: "", scheduled_at: "", meeting_link: "" });

  useEffect(() => {
    if (open) {
      supabase.from("recruitment").select("id, candidate_name, position").then(({ data }) => setCandidates(data || []));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("interviews").insert({
        recruitment_id: form.recruitment_id,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        meeting_link: form.meeting_link || null,
      });
      if (error) throw error;
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
                {candidates.map(c => <SelectItem key={c.id} value={c.id}>{c.candidate_name} — {c.position}</SelectItem>)}
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
