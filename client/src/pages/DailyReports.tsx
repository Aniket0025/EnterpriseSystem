import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubmitReportDialog } from "@/components/dialogs/SubmitReportDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function DailyReports() {
  const { user, role } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const isAdmin = role === "super_admin" || role === "hr_admin";

  const fetchReports = async () => {
    if (!user) return;
    const query = supabase.from("daily_reports").select("*").order("report_date", { ascending: false }).limit(20);
    if (!isAdmin) query.eq("user_id", user.id);
    const { data } = await query;
    setReports(data || []);
  };

  useEffect(() => { fetchReports(); }, [user]);

  return (
    <div>
      <PageHeader title="Daily Work Reports" description="View and submit daily progress updates" action={<SubmitReportDialog onSuccess={fetchReports} />} />
      <div className="space-y-4">
        {reports.map((report, i) => (
          <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{format(new Date(report.report_date), "MMM d, yyyy")}</CardTitle>
                  <Badge variant={report.status === "reviewed" ? "default" : "secondary"} className="capitalize">{report.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {reports.length === 0 && <p className="text-center text-muted-foreground py-8">No reports yet. Submit your first daily report!</p>}
      </div>
    </div>
  );
}
