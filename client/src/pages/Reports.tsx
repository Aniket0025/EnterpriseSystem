import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, BarChart3, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const reportTypes = [
  { title: "Employee Report", description: "Headcount, departments, roles distribution", icon: Users, color: "bg-primary/10 text-primary" },
  { title: "Payroll Report", description: "Salary, bonuses, deductions breakdown", icon: DollarSign, color: "bg-success/10 text-success" },
  { title: "Task Report", description: "Task completion rates and performance", icon: BarChart3, color: "bg-warning/10 text-warning" },
  { title: "Leave Report", description: "Leave utilization and patterns", icon: FileText, color: "bg-info/10 text-info" },
];

const quarterlyData = [
  { quarter: "Q1", revenue: 1200000, expenses: 980000 },
  { quarter: "Q2", revenue: 1350000, expenses: 1050000 },
  { quarter: "Q3", revenue: 1500000, expenses: 1100000 },
  { quarter: "Q4", revenue: 1420000, expenses: 1080000 },
];

export default function Reports() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Generate and export organizational reports"
        action={
          <div className="flex items-center gap-2">
            <Select defaultValue="2026">
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button><Download className="h-4 w-4 mr-2" />Export All</Button>
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
                <Button variant="outline" size="sm" className="mt-3 w-full">
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
            <YAxis fontSize={12} tickFormatter={(v) => `$${v / 1000000}M`} />
            <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="expenses" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
