import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import { ApplyLeaveDialog } from "@/components/dialogs/ApplyLeaveDialog";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarOff, Check, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Leave() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = role === "super_admin" || role === "hr_admin";

  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch leaves");
      return res.json();
    },
    enabled: !!user
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/leaves/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (data, variables) => {
      toast.success(`Leave request ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const approved = leaves.filter((l: any) => l.status === "approved").length;
  const pending = leaves.filter((l: any) => l.status === "pending").length;
  const rejected = leaves.filter((l: any) => l.status === "rejected").length;

  const columns = [
    { 
      key: "user", 
      label: "Employee", 
      render: (item: any) => item.user_id ? (item.user_id.full_name || item.user_id.email) : "Unknown"
    },
    { key: "leave_type", label: "Type", render: (item: any) => <span className="capitalize">{item.leave_type}</span> },
    { key: "start_date", label: "From", render: (item: any) => format(new Date(item.start_date), "MMM d, yyyy") },
    { key: "end_date", label: "To", render: (item: any) => format(new Date(item.end_date), "MMM d, yyyy") },
    { key: "reason", label: "Reason", render: (item: any) => item.reason || "—" },
    {
      key: "status", label: "Status",
      render: (item: any) => (
        <Badge variant={item.status === "approved" ? "default" : item.status === "rejected" ? "destructive" : "secondary"} className="capitalize">
          {item.status}
        </Badge>
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (item: any) => {
        if (item.status !== "pending") return null;
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 text-green-600 hover:text-green-700"
              onClick={() => updateStatusMutation.mutate({ id: item._id, status: "approved" })}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 text-red-600 hover:text-red-700"
              onClick={() => updateStatusMutation.mutate({ id: item._id, status: "rejected" })}
              disabled={updateStatusMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        );
      }
    } as any);
  }

  return (
    <div>
      <PageHeader 
        title="Leave Management" 
        description="Track and approve employee leave requests" 
        action={<ApplyLeaveDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["leaves"] })} />} 
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Requests" value={leaves.length} icon={CalendarOff} index={0} />
        <StatsCard title="Approved" value={approved} icon={Check} index={1} />
        <StatsCard title="Pending" value={pending} icon={Clock} index={2} />
        <StatsCard title="Rejected" value={rejected} icon={AlertTriangle} index={3} />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={leaves} />
      )}
    </div>
  );
}
