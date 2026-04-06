import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface Props { onSuccess?: () => void; }

export function SubmitReportDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("daily_reports").insert({
        user_id: user.id,
        description,
      });
      if (error) throw error;
      toast({ title: "Report submitted!" });
      setDescription("");
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
        <Button><Plus className="h-4 w-4 mr-2" />Submit Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Submit Daily Report</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>What did you work on today? *</Label>
            <Textarea required value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe your tasks, progress, and any blockers..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Submitting..." : "Submit Report"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
