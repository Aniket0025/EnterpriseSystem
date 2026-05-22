import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, BarChart3, Users, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const reportTypes = [
  { title: "Employee Report", type: "employee", description: "Headcount, departments, roles distribution", icon: Users, color: "bg-primary/10 text-primary" },
  { title: "Payroll Report", type: "payroll", description: "Salary, bonuses, deductions breakdown", icon: IndianRupee, color: "bg-success/10 text-success" },
  { title: "Task Report", type: "task", description: "Task completion rates and performance", icon: BarChart3, color: "bg-warning/10 text-warning" },
  { title: "Leave Report", type: "leave", description: "Leave utilization and patterns", icon: FileText, color: "bg-info/10 text-info" },
];

export default function Reports() {
  const [quarterlyData, setQuarterlyData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${API_URL}/analytics?year=${selectedYear}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.quarterlyData) {
          setQuarterlyData(data.quarterlyData);
        }
      })
      .catch(err => console.error(err));
  }, [selectedYear]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString();
  };

  const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
    if (!rows || rows.length === 0) {
      toast({ title: "No data available to download", variant: "destructive" });
      return;
    }
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => {
          const cellStr = String(cell || '').replace(/\r?\n|\r/g, ' ');
          return `"${cellStr.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\r\n');
    
    // Add \uFEFF BOM for Microsoft Excel UTF-8 recognition
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatEmployeeData = (data: any[]) => {
    const headers = ["S.No", "Name", "Email", "Phone", "Department", "Role", "Salary (INR)", "Status", "Joining Date"];
    const rows = data.map((emp, i) => [
      String(i + 1),
      emp.name || emp.full_name || "",
      emp.email || "",
      emp.phone || "",
      emp.department || "",
      emp.role || "",
      String(emp.salary || 0),
      emp.status || "",
      formatDate(emp.createdAt)
    ]);
    return { headers, rows };
  };

  const formatPayrollData = (data: any[]) => {
    const headers = ["S.No", "Employee Name", "Role", "Department", "Base Salary (INR)", "Bonus (INR)", "Deductions (INR)", "Net Pay (INR)", "Month", "Status"];
    const rows = data.map((p, i) => [
      String(i + 1),
      p.employee_name || "",
      p.role || "",
      p.department || "",
      String(p.base_salary || 0),
      String(p.bonus || 0),
      String(p.deductions || 0),
      String(p.net_pay || 0),
      p.month || "",
      p.status || ""
    ]);
    return { headers, rows };
  };

  const formatTaskData = (data: any[]) => {
    const headers = ["S.No", "Title", "Priority", "Status", "Assigned To", "Deadline", "Submitted On", "Created Date"];
    const rows = data.map((t, i) => [
      String(i + 1),
      t.title || "",
      t.priority || "",
      t.status || "",
      t.assigned_to?.full_name || t.assigned_to?.name || "",
      formatDate(t.deadline),
      t.submission?.submitted_at ? formatDate(t.submission.submitted_at) : "No",
      formatDate(t.createdAt)
    ]);
    return { headers, rows };
  };

  const formatLeaveData = (data: any[]) => {
    const headers = ["S.No", "Employee", "Leave Type", "Start Date", "End Date", "Reason", "Status", "Applied On"];
    const rows = data.map((l, i) => [
      String(i + 1),
      l.user_id?.full_name || l.user_id?.name || "",
      l.leave_type || "",
      formatDate(l.start_date),
      formatDate(l.end_date),
      l.reason || "",
      l.status || "",
      formatDate(l.createdAt)
    ]);
    return { headers, rows };
  };

  const handleDownload = async (type: string) => {
    setIsDownloading(true);
    try {
      let url = "";
      let filename = "";
      let formatter: (data: any[]) => { headers: string[], rows: string[][] };
      
      switch(type) {
        case 'employee': url = `${API_URL}/employees`; filename = "employee_report"; formatter = formatEmployeeData; break;
        case 'payroll': url = `${API_URL}/payroll`; filename = "payroll_report"; formatter = formatPayrollData; break;
        case 'task': url = `${API_URL}/tasks`; filename = "task_report"; formatter = formatTaskData; break;
        case 'leave': url = `${API_URL}/leaves`; filename = "leave_report"; formatter = formatLeaveData; break;
      }
      
      const token = localStorage.getItem('token');
      const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` }});
      if (!res.ok) throw new Error("Failed to fetch data");
      
      const data = await res.json();
      const { headers, rows } = formatter(data);
      downloadCSV(headers, rows, filename);
      toast({ title: `${filename}.csv downloaded successfully!` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error downloading report", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportAll = async () => {
    await handleDownload('employee');
    await handleDownload('payroll');
    await handleDownload('task');
    await handleDownload('leave');
  };

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Generate and export organizational reports"
        action={
          <div className="flex items-center gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportAll} disabled={isDownloading}>
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Exporting..." : "Export All"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {reportTypes.map((report, i) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${report.color}`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-sm">{report.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full" 
                  onClick={() => handleDownload(report.type)}
                  disabled={isDownloading}
                >
                  <Download className="h-3.5 w-3.5 mr-2" />Download
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="rounded-xl border bg-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold mb-4">Quarterly Overview</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={quarterlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="quarter" fontSize={12} />
            <YAxis fontSize={12} tickFormatter={(v) => `₹${v / 1000000}M`} />
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="expenses" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
