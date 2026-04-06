import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTaskDialog } from "@/components/dialogs/AddTaskDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { format } from "date-fns";

export default function Tasks() {
  const { user, role } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const isAdmin = role === "super_admin" || role === "hr_admin";

  const fetchTasks = async () => {
    if (!user) return;
    const query = supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (!isAdmin) query.eq("assigned_to", user.id);
    const { data } = await query;
    setTasks(data || []);
  };

  useEffect(() => { fetchTasks(); }, [user]);

  const columns = ["pending", "in_progress", "completed"] as const;
  const labels: Record<string, string> = { pending: "To Do", in_progress: "In Progress", completed: "Done" };
  const priorityColors: Record<string, string> = { high: "text-destructive", medium: "text-warning", low: "text-muted-foreground" };

  return (
    <div>
      <PageHeader title="Tasks" description="Manage and track task assignments" action={<AddTaskDialog onSuccess={fetchTasks} />} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-sm">{labels[col]}</h3>
              <Badge variant="secondary" className="text-xs">{tasks.filter((t) => t.status === col).length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter((t) => t.status === col).map((task, i) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                        <span className={`text-xs font-medium capitalize ${priorityColors[task.priority] || ""}`}>{task.priority}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {task.description && <p className="text-xs text-muted-foreground mb-3">{task.description}</p>}
                      {task.deadline && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(task.deadline), "MMM d, yyyy")}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
