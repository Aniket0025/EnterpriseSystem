import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
  { key: "role", label: "Role" },
  { key: "salary", label: "Salary" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <Badge variant={item.status === "Active" ? "default" : "secondary"}>
        {item.status}
      </Badge>
    ),
  },
];

export default function Employees() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [form, setForm] = useState({ name: "", email: "", phone: "", department: "", role: "", salary: "", password: "" });

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: "Employee created and access granted!" });
      setForm({ name: "", email: "", phone: "", department: "", role: "", salary: "", password: "" });
      setOpen(false);
      fetchEmployees();
    } catch (err: any) {
      toast({ title: "Creation Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage your organization's workforce"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="John Smith" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="john@company.com" type="email" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input value={form.department} onChange={e=>setForm({...form, department: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Input value={form.role} onChange={e=>setForm({...form, role: e.target.value})} placeholder="Developer" />
                  </div>
                  <div>
                    <Label>Salary</Label>
                    <Input value={form.salary} onChange={e=>setForm({...form, salary: e.target.value})} placeholder="$75,000" />
                  </div>
                </div>
                <div>
                   <Label>Account Password</Label>
                   <Input required type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} placeholder="Password for their login" />
                </div>
                <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Create Employee"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <motion.div
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </motion.div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
