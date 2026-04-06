import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, CalendarClock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: 1, type: "task", title: "Task deadline approaching", message: "Design new landing page is due in 2 days", time: "5 min ago", read: false, icon: AlertCircle },
  { id: 2, type: "leave", title: "Leave request approved", message: "Your casual leave from Apr 8-10 has been approved", time: "1 hour ago", read: false, icon: CheckCircle },
  { id: 3, type: "interview", title: "Interview reminder", message: "Interview with Alice Johnson at 10:00 AM tomorrow", time: "2 hours ago", read: false, icon: CalendarClock },
  { id: 4, type: "report", title: "Daily report pending", message: "You haven't submitted your daily report for today", time: "3 hours ago", read: true, icon: FileText },
  { id: 5, type: "task", title: "New task assigned", message: "You've been assigned: Database optimization", time: "5 hours ago", read: true, icon: Bell },
  { id: 6, type: "leave", title: "Leave request submitted", message: "Emma Davis has requested casual leave", time: "1 day ago", read: true, icon: CalendarClock },
];

const typeColors: Record<string, string> = {
  task: "bg-primary/10 text-primary",
  leave: "bg-success/10 text-success",
  interview: "bg-warning/10 text-warning",
  report: "bg-info/10 text-info",
};

export default function Notifications() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with important alerts"
        action={<Button variant="outline">Mark All Read</Button>}
      />

      <div className="space-y-3 max-w-2xl">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`transition-colors ${!notif.read ? "border-primary/30 bg-primary/5" : ""}`}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[notif.type]}`}>
                  <notif.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{notif.title}</p>
                    {!notif.read && <Badge className="h-4 text-[10px]">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
