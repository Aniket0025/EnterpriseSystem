import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { AddBatchDialog } from "@/components/dialogs/AddBatchDialog";
import { EditBatchDialog } from "@/components/dialogs/EditBatchDialog";
import { useAuth } from "@/contexts/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Batches() {
  const [batches, setBatches] = useState<any[]>([]);
  const { role, user } = useAuth();
  const isHR = role === "super_admin" || role === "hr_admin";

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API_URL}/batches`);
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchBatches(); }, []);

  const columns = [
    { key: "name", label: "Batch Name" },
    { key: "course", label: "Course" },
    { key: "start_date", label: "Start Date", render: (item: any) => item.start_date ? new Date(item.start_date).toLocaleDateString() : "—" },
    { key: "end_date", label: "End Date", render: (item: any) => item.end_date ? new Date(item.end_date).toLocaleDateString() : "—" },
    { key: "max_students", label: "Max Students" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => {
        let cStatus = 'upcoming';
        if (item.start_date) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const start = new Date(item.start_date);
            const end = item.end_date ? new Date(item.end_date) : null;
            if (now >= start && (!end || now <= end)) cStatus = 'active';
            else if (end && now > end) cStatus = 'completed';
        }
        return (
          <Badge variant={cStatus === "active" ? "default" : cStatus === "completed" ? "outline" : "secondary"} className="capitalize">{cStatus}</Badge>
        );
      },
    },
    ...(isHR ? [{
      key: "actions",
      label: "",
      render: (item: any) => (
        <div onClick={e => e.stopPropagation()}>
          <EditBatchDialog batch={item} onSuccess={fetchBatches} />
        </div>
      ),
    }] : []),
  ];

  const filteredBatches = batches.filter(b => {
    if (role === 'trainer') return b.trainer_id?.user_id === user?.id;
    return true;
  });

  return (
    <div>
      <PageHeader title="Batches" description="Manage training batches and courses" action={isHR ? <AddBatchDialog onSuccess={fetchBatches} /> : undefined} />
      <DataTable columns={columns} data={filteredBatches} />
    </div>
  );
}
