import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTaskDialog } from "@/components/dialogs/AddTaskDialog";
import { SubmitTaskDialog } from "@/components/dialogs/SubmitTaskDialog";
import { FilePreviewDialog } from "@/components/dialogs/FilePreviewDialog";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Clock, CheckCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:5000/api";

export default function Tasks() {
  const { user, role } = useAuth();
  const isAdmin = role === "super_admin" || role === "hr_admin";
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    enabled: !!user
  });

  const columns = ["pending", "in_progress", "completed"] as const;
  const labels: Record<string, string> = { pending: "To Do", in_progress: "In Progress", completed: "Done" };
  const priorityColors: Record<string, string> = { high: "text-destructive", medium: "text-warning", low: "text-muted-foreground" };

  return (
    <div>
      <PageHeader 
        title="Tasks" 
        description="Manage and track task assignments" 
        action={isAdmin ? <AddTaskDialog onSuccess={refetch} /> : undefined} 
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-sm">{labels[col]}</h3>
              <Badge variant="secondary" className="text-xs">{tasks.filter((t: any) => t.status === col).length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter((t: any) => t.status === col).map((task: any, i: number) => (
                <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                        <span className={`text-xs font-medium capitalize ${priorityColors[task.priority] || ""}`}>{task.priority}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {task.description && <p className="text-xs text-muted-foreground mb-3">{task.description}</p>}
                      {task.assigned_to && isAdmin && (
                        <p className="text-xs font-medium text-primary mb-2">Assigned to: {task.assigned_to.full_name || task.assigned_to.email}</p>
                      )}
                      <div className="flex justify-between items-end mt-4">
                        {task.deadline && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(new Date(task.deadline), "MMM d, yyyy")}
                          </span>
                        )}
                        {task.status !== "completed" && !isAdmin && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsSubmitOpen(true);
                            }}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submit
                          </Button>
                        )}
                        {task.status === "completed" && task.submission && (
                           <div className="mt-2 text-xs">
                             <span className="font-semibold">Submission: </span>
                             {task.submission.submission_type === "file" ? (
                               <FilePreviewDialog url={task.submission.content} triggerText="View File" />
                             ) : (
                               <p className="italic bg-muted p-2 rounded mt-1">{task.submission.content}</p>
                             )}
                           </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <SubmitTaskDialog 
        task={selectedTask} 
        isOpen={isSubmitOpen} 
        onClose={() => setIsSubmitOpen(false)} 
      />
    </div>
  );
}
