import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import { DollarSign, TrendingUp, TrendingDown, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const payrollData = [
  { month: "Jan", total: 380000 },
  { month: "Feb", total: 385000 },
  { month: "Mar", total: 390000 },
  { month: "Apr", total: 425000 },
  { month: "May", total: 410000 },
  { month: "Jun", total: 420000 },
];

const payslips = [
  { id: 1, employee: "John Smith", department: "Engineering", baseSalary: "$8,000", bonus: "$500", deductions: "$800", net: "$7,700", status: "Paid" },
  { id: 2, employee: "Sarah Wilson", department: "Marketing", baseSalary: "$7,000", bonus: "$300", deductions: "$700", net: "$6,600", status: "Paid" },
  { id: 3, employee: "Mike Johnson", department: "Sales", baseSalary: "$6,500", bonus: "$1,200", deductions: "$650", net: "$7,050", status: "Pending" },
  { id: 4, employee: "Emma Davis", department: "Design", baseSalary: "$6,000", bonus: "$200", deductions: "$600", net: "$5,600", status: "Paid" },
  { id: 5, employee: "Alex Brown", department: "Engineering", baseSalary: "$7,500", bonus: "$400", deductions: "$750", net: "$7,150", status: "Pending" },
];

const columns = [
  { key: "employee", label: "Employee" },
  { key: "department", label: "Department" },
  { key: "baseSalary", label: "Base Salary" },
  { key: "bonus", label: "Bonus" },
  { key: "deductions", label: "Deductions" },
  { key: "net", label: "Net Pay" },
  {
    key: "status",
    label: "Status",
    render: (item: typeof payslips[0]) => (
      <Badge variant={item.status === "Paid" ? "default" : "secondary"}>{item.status}</Badge>
    ),
  },
];

export default function Payroll() {
  return (
    <div>
      <PageHeader
        title="Payroll Management"
        description="Process salaries and manage compensation"
        action={<Button><FileText className="h-4 w-4 mr-2" />Generate Payslips</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Payroll" value="$425K" icon={DollarSign} index={0} />
        <StatsCard title="Avg Salary" value="$7,100" change="+2.5%" changeType="positive" icon={TrendingUp} index={1} />
        <StatsCard title="Total Bonuses" value="$12.6K" icon={TrendingUp} index={2} />
        <StatsCard title="Total Deductions" value="$18.5K" icon={TrendingDown} index={3} />
      </div>

      <motion.div
        className="rounded-xl border bg-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold mb-4">Monthly Payroll Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={payrollData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
            <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
            <Bar dataKey="total" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <DataTable columns={columns} data={payslips} />
    </div>
  );
}
