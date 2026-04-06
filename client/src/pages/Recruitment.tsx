import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import { AddCandidateDialog } from "@/components/dialogs/AddCandidateDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Users, CheckCircle, XCircle } from "lucide-react";

export default function Recruitment() {
  const [candidates, setCandidates] = useState<any[]>([]);

  const fetch = async () => {
    const { data } = await supabase.from("recruitment").select("*").order("created_at", { ascending: false });
    setCandidates(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    applied: "outline", shortlisted: "secondary", interview: "default", selected: "default", rejected: "destructive",
  };

  const columns = [
    { key: "candidate_name", label: "Candidate" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (item: any) => item.phone || "—" },
    { key: "status", label: "Status", render: (item: any) => <Badge variant={statusVariant[item.status] || "secondary"} className="capitalize">{item.status}</Badge> },
  ];

  const selected = candidates.filter(c => c.status === "selected").length;
  const rejected = candidates.filter(c => c.status === "rejected").length;

  return (
    <div>
      <PageHeader title="Recruitment" description="Track candidates and hiring pipeline" action={<AddCandidateDialog onSuccess={fetch} />} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Applicants" value={candidates.length} icon={UserPlus} index={0} />
        <StatsCard title="In Pipeline" value={candidates.length - selected - rejected} icon={Users} index={1} />
        <StatsCard title="Selected" value={selected} icon={CheckCircle} index={2} />
        <StatsCard title="Rejected" value={rejected} icon={XCircle} index={3} />
      </div>
      <DataTable columns={columns} data={candidates} />
    </div>
  );
}
