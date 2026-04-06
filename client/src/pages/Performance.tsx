import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const employees = [
  { name: "John Smith", department: "Engineering", tasksCompleted: 24, totalTasks: 28, rating: 4.5, trend: "up" },
  { name: "Sarah Wilson", department: "Marketing", tasksCompleted: 18, totalTasks: 20, rating: 4.8, trend: "up" },
  { name: "Mike Johnson", department: "Sales", tasksCompleted: 15, totalTasks: 22, rating: 3.9, trend: "down" },
  { name: "Emma Davis", department: "Design", tasksCompleted: 20, totalTasks: 22, rating: 4.7, trend: "up" },
  { name: "Alex Brown", department: "Engineering", tasksCompleted: 22, totalTasks: 25, rating: 4.2, trend: "stable" },
];

const monthlyData = [
  { month: "Jan", avgScore: 78 },
  { month: "Feb", avgScore: 80 },
  { month: "Mar", avgScore: 82 },
  { month: "Apr", avgScore: 85 },
  { month: "May", avgScore: 83 },
  { month: "Jun", avgScore: 88 },
];

export default function Performance() {
  return (
    <div>
      <PageHeader title="Performance Management" description="Track and evaluate employee performance" />

      <motion.div
        className="rounded-xl border bg-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold mb-4">Average Performance Score</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} domain={[60, 100]} />
            <Tooltip />
            <Bar dataKey="avgScore" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp, i) => (
          <motion.div
            key={emp.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{emp.name}</CardTitle>
                  <Badge variant="secondary">{emp.department}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Tasks: {emp.tasksCompleted}/{emp.totalTasks}</span>
                    <span>{Math.round((emp.tasksCompleted / emp.totalTasks) * 100)}%</span>
                  </div>
                  <Progress value={(emp.tasksCompleted / emp.totalTasks) * 100} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">{emp.rating}/5.0</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
