import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Performance() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/performance`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setEmployees(data.employees || []);
          setMonthlyData(data.monthlyData || []);
        }
      })
      .catch(err => console.error(err));
  }, []);
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
                    <span>{emp.totalTasks > 0 ? Math.round((emp.tasksCompleted / emp.totalTasks) * 100) : 0}%</span>
                  </div>
                  <Progress value={emp.totalTasks > 0 ? (emp.tasksCompleted / emp.totalTasks) * 100 : 0} />
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
