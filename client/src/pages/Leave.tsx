import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import { ApplyLeaveDialog } from "@/components/dialogs/ApplyLeaveDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CalendarOff, Check, Clock, AlertTriangle } from "lucide-react";

export default function Leave() {
  const { user, role } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const isAdmin = role === "super_admin" || role === "hr_admin";

  const fetchLeaves = async () => {
    if (!user) return;
    const query = supabase.from("leaves").select("*").order("created_at", { ascending: false });
    if (!isAdmin) query.eq("user_id", user.id);
    const { data } = await query;
    setLeaves(data || []);
  };

  useEffect(() => { fetchLeaves(); }, [user]);

  const approved = leaves.filter(l => l.status === "approved").length;
  const pending = leaves.filter(l => l.status === "pending").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  const columns = [
    { key: "leave_type", label: "Type", render: (item: any) => <span className="capitalize">{item.leave_type}</span> },
    { key: "start_date", label: "From" },
    { key: "end_date", label: "To" },
    { key: "reason", label: "Reason", render: (item: any) => item.reason || "—" },
    {
      key: "status", label: "Status",
      render: (item: any) => (
        <Badge variant={item.status === "approved" ? "default" : item.status === "rejected" ? "destructive" : "secondary"} className="capitalize">{item.status}</Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Leave Management" description="Track and approve employee leave requests" action={<ApplyLeaveDialog onSuccess={fetchLeaves} />} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Requests" value={leaves.length} icon={CalendarOff} index={0} />
        <StatsCard title="Approved" value={approved} icon={Check} index={1} />
        <StatsCard title="Pending" value={pending} icon={Clock} index={2} />
        <StatsCard title="Rejected" value={rejected} icon={AlertTriangle} index={3} />
      </div>
      <DataTable columns={columns} data={leaves} />
    </div>
  );
}
