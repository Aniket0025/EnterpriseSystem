import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, CalendarClock, FileText, IndianRupee, Trash2, CheckCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const typeConfig: Record<string, { icon: any; color: string }> = {
  task: { icon: AlertCircle, color: "bg-blue-100 text-blue-600" },
  leave: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
  interview: { icon: CalendarClock, color: "bg-amber-100 text-amber-600" },
  report: { icon: FileText, color: "bg-purple-100 text-purple-600" },
  payroll: { icon: IndianRupee, color: "bg-green-100 text-green-600" },
  system: { icon: Bell, color: "bg-slate-100 text-slate-600" },
};

interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + realtime polling every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast({ title: "All notifications marked as read" });
      }
    } catch (err) {
      toast({ title: "Error marking notifications", variant: "destructive" });
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        toast({ title: "Notification deleted" });
      }
    } catch (err) {
      toast({ title: "Error deleting notification", variant: "destructive" });
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.read) markAsRead(notif._id);
    if (notif.action_url) navigate(notif.action_url);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : "You're all caught up"}
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead} disabled={markingAll}>
                <CheckCheck className="h-4 w-4 mr-2" />
                {markingAll ? "Marking..." : "Mark All Read"}
              </Button>
            )}
            <Button variant="outline" onClick={fetchNotifications}>
              <Bell className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        }
      />

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Notifications will appear here when there are updates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 max-w-2xl">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, i) => {
              const config = typeConfig[notif.type] || typeConfig.system;
              const Icon = config.icon;
              return (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  transition={{ delay: i * 0.03 }}
                  layout
                >
                  <Card
                    className={`transition-all cursor-pointer group ${!notif.read ? "border-primary/30 bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${!notif.read ? 'font-semibold' : 'font-medium'}`}>{notif.title}</p>
                          {!notif.read && <Badge className="h-4 text-[10px]">New</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
