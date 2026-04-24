import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmitReportDialog } from "@/components/dialogs/SubmitReportDialog";
import { FilePreviewDialog } from "@/components/dialogs/FilePreviewDialog";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, Clock, ExternalLink } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function DailyReports() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = role === "super_admin" || role === "hr_admin";

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
    enabled: !!user
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reports/${id}/status`, {
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
      toast.success(`Report marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  return (
    <div>
      <PageHeader 
        title="Daily Work Reports" 
        description="View and submit daily progress updates" 
        action={!isAdmin ? <SubmitReportDialog /> : undefined} 
      />
      
      {isLoading ? (
        <div className="flex justify-center p-8"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any, i: number) => (
            <motion.div key={report._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {format(new Date(report.report_date), "MMM d, yyyy")}
                        {isAdmin && report.user_id && (
                          <span className="text-primary">• {report.user_id.full_name || report.user_id.email}</span>
                        )}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" /> {report.hours_worked} hrs
                      </span>
                      <Badge variant={report.status === "reviewed" ? "default" : "secondary"} className="capitalize">
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {report.attachment && (
                        <FilePreviewDialog url={report.attachment} />
                      )}
                    </div>
                    
                    {isAdmin && report.status === "pending" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-green-600 hover:text-green-700"
                        onClick={() => updateStatusMutation.mutate({ id: report._id, status: "reviewed" })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Mark as Reviewed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {reports.length === 0 && <p className="text-center text-muted-foreground py-8">No reports found.</p>}
        </div>
      )}
    </div>
  );
}
