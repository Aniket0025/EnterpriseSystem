import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface Props { onSuccess?: () => void; }

export function AddCandidateDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ candidate_name: "", email: "", phone: "", position: "", notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("recruitment").insert({
        candidate_name: form.candidate_name,
        email: form.email,
        phone: form.phone || null,
        position: form.position,
        notes: form.notes || null,
      });
      if (error) throw error;
      toast({ title: "Candidate added!" });
      setForm({ candidate_name: "", email: "", phone: "", position: "", notes: "" });
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
        <Button><Plus className="h-4 w-4 mr-2" />Add Candidate</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Candidate</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Candidate Name *</Label>
            <Input required value={form.candidate_name} onChange={e => setForm({ ...form, candidate_name: e.target.value })} />
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
            <Label>Position *</Label>
            <Input required value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Candidate"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
