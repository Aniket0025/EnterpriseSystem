import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScheduleInterviewDialog } from "@/components/dialogs/ScheduleInterviewDialog";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Video, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Interviews() {
  const [interviews, setInterviews] = useState<any[]>([]);

  const fetch = async () => {
    const { data } = await supabase
      .from("interviews")
      .select("*, recruitment(candidate_name, position)")
      .order("scheduled_at", { ascending: false });
    setInterviews(data || []);
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <PageHeader title="Interview Scheduling" description="Schedule and manage candidate interviews" action={<ScheduleInterviewDialog onSuccess={fetch} />} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((interview, i) => (
          <motion.div key={interview.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{interview.recruitment?.candidate_name || "Unknown"}</CardTitle>
                  <Badge variant={interview.status === "completed" ? "secondary" : "default"} className="capitalize">{interview.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{interview.recruitment?.position || ""}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(interview.scheduled_at), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {format(new Date(interview.scheduled_at), "hh:mm a")}
                  </div>
                </div>
                {interview.meeting_link && (
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">
                      <Video className="h-3.5 w-3.5 mr-2" />Join Meeting
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {interviews.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">No interviews scheduled yet.</p>}
      </div>
    </div>
  );
}
