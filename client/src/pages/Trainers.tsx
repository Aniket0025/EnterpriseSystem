import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { AddTrainerDialog } from "@/components/dialogs/AddTrainerDialog";
import { EditTrainerDialog } from "@/components/dialogs/EditTrainerDialog";

export default function Trainers() {
  const [trainers, setTrainers] = useState<any[]>([]);

  const fetchTrainers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/trainers");
      const data = await res.json();
      setTrainers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTrainers(); }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
    { key: "experience_years", label: "Experience (yrs)" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <Badge variant={item.status === "active" ? "default" : "secondary"} className="capitalize">{item.status}</Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: any) => (
        <div onClick={e => e.stopPropagation()}>
          <EditTrainerDialog trainer={item} onSuccess={fetchTrainers} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Trainers" description="Manage trainers and their assignments" action={<AddTrainerDialog onSuccess={fetchTrainers} />} />
      <DataTable columns={columns} data={trainers} />
    </div>
  );
}
