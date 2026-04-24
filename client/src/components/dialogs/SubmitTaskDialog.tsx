import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_URL = "http://localhost:5000/api";

interface Props {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitTaskDialog({ task, isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      if (activeTab === "text") {
        formData.append("text_content", textContent);
      } else if (activeTab === "file" && file) {
        formData.append("file", file);
      } else {
        throw new Error("Please provide either text content or a file to submit.");
      }

      const res = await fetch(`${API_URL}/tasks/${task._id}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // don't set Content-Type, browser will set boundary for multipart
        },
        body: formData
      });
      
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast.success("Task submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Task: {task.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Submit Text</TabsTrigger>
              <TabsTrigger value="file">Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Type your submission here..."
                rows={5}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
            </TabsContent>
            <TabsContent value="file" className="mt-4">
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <p className="text-xs text-muted-foreground mt-2">Accepted formats: PDF, DOC, Images.</p>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? "Submitting..." : "Submit Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
