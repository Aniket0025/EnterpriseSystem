import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Props { onSuccess?: () => void; }

export function SubmitReportDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState("");
  const [hoursWorked, setHoursWorked] = useState("8");
  const [file, setFile] = useState<File | null>(null);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("description", description);
      formData.append("hours_worked", hoursWorked);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Report submitted successfully!" });
      setDescription("");
      setHoursWorked("8");
      setFile(null);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      onSuccess?.();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    submitMutation.mutate();
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
            <Textarea 
              required 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4} 
              placeholder="Describe your tasks, progress, and any blockers..." 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hours Worked *</Label>
              <Input 
                type="number" 
                required 
                min="0.5" 
                step="0.5" 
                value={hoursWorked} 
                onChange={e => setHoursWorked(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Attachment (Optional)</Label>
              <Input 
                type="file" 
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
