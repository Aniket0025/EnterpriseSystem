import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import { IndianRupee, TrendingUp, TrendingDown, FileText, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { EditPayrollDialog } from "@/components/dialogs/EditPayrollDialog";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Payroll() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  
  const [editingPayroll, setEditingPayroll] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: payslips = [], isLoading } = useQuery({
    queryKey: ["payroll"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/payroll`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch payroll");
      return res.json();
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/payroll/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate payslips");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Payslips generated successfully");
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/payroll/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (data, variables) => {
      toast.success(`Payslip marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleExport = () => {
    if (payslips.length === 0) {
      toast.error("No payroll data to export");
      return;
    }
    
    // Format data for excel
    const exportData = payslips.map((item: any) => ({
      "Employee Name": item.employee_name,
      "Role": item.role,
      "Department": item.department,
      "Base Salary (₹)": item.base_salary,
      "Bonus (₹)": item.bonus,
      "Deductions (₹)": item.deductions,
      "Net Pay (₹)": item.net_pay,
      "Month": item.month,
      "Status": item.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");
    
    // Auto-size columns
    const maxWidths = Object.keys(exportData[0]).map(key => ({ wch: Math.max(key.length, 15) }));
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, `Payroll_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Exported successfully!");
  };

  // Calculate dynamic stats
  const totalPayroll = payslips.reduce((acc: number, curr: any) => acc + curr.net_pay, 0);
  const avgSalary = payslips.length > 0 ? totalPayroll / payslips.length : 0;
  const totalBonuses = payslips.reduce((acc: number, curr: any) => acc + curr.bonus, 0);
  const totalDeductions = payslips.reduce((acc: number, curr: any) => acc + curr.deductions, 0);

  // Group by month for the chart
  const monthlyDataMap: { [key: string]: number } = {};
  payslips.forEach((p: any) => {
    monthlyDataMap[p.month] = (monthlyDataMap[p.month] || 0) + p.net_pay;
  });
  const payrollChartData = Object.entries(monthlyDataMap).map(([month, total]) => ({ month, total }));

  const columns = [
    { key: "employee_name", label: "Employee" },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    { key: "base_salary", label: "Base Salary", render: (item: any) => `₹${item.base_salary.toLocaleString()}` },
    { key: "bonus", label: "Bonus", render: (item: any) => `₹${item.bonus.toLocaleString()}` },
    { key: "deductions", label: "Deductions", render: (item: any) => `₹${item.deductions.toLocaleString()}` },
    { key: "net_pay", label: "Net Pay", render: (item: any) => `₹${item.net_pay.toLocaleString()}` },
    { key: "month", label: "Month" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <Badge variant={item.status === "Paid" ? "default" : "secondary"}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setEditingPayroll(item);
            setIsEditDialogOpen(true);
          }}
        >
          <Edit2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payroll Management"
        description="Process salaries and manage compensation"
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleExport}
              disabled={payslips.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button 
              onClick={() => generateMutation.mutate()} 
              disabled={generateMutation.isPending}
            >
              <FileText className="h-4 w-4 mr-2" />
              {generateMutation.isPending ? "Generating..." : "Generate Payslips"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Payroll" value={`₹${(totalPayroll / 1000).toFixed(1)}K`} icon={IndianRupee} index={0} />
        <StatsCard title="Avg Salary" value={`₹${Math.round(avgSalary).toLocaleString()}`} changeType="neutral" icon={TrendingUp} index={1} />
        <StatsCard title="Total Bonuses" value={`₹${(totalBonuses / 1000).toFixed(1)}K`} icon={TrendingUp} index={2} />
        <StatsCard title="Total Deductions" value={`₹${(totalDeductions / 1000).toFixed(1)}K`} icon={TrendingDown} index={3} />
      </div>

      <motion.div
        className="rounded-xl border bg-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold mb-4">Monthly Payroll Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={payrollChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
            <Bar dataKey="total" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center p-8"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={payslips} />
      )}

      <EditPayrollDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        payroll={editingPayroll} 
      />
    </div>
  );
}
