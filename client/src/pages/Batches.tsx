import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { AddBatchDialog } from "@/components/dialogs/AddBatchDialog";

export default function Batches() {
  const [batches, setBatches] = useState<any[]>([]);

  const fetchBatches = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/batches");
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
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date", render: (item: any) => item.end_date || "—" },
    { key: "max_students", label: "Max Students" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <Badge variant={item.status === "active" ? "default" : "secondary"} className="capitalize">{item.status}</Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Batches" description="Manage training batches and courses" action={<AddBatchDialog onSuccess={fetchBatches} />} />
      <DataTable columns={columns} data={batches} />
    </div>
  );
}
