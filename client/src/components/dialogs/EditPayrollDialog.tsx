import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = "http://localhost:5000/api";

interface EditPayrollDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: any;
}

export function EditPayrollDialog({ isOpen, onClose, payroll }: EditPayrollDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    base_salary: 0,
    bonus: 0,
    deductions: 0,
    net_pay: 0,
    month: "",
    status: "Pending",
  });

  useEffect(() => {
    if (payroll) {
      setFormData({
        base_salary: payroll.base_salary,
        bonus: payroll.bonus,
        deductions: payroll.deductions,
        net_pay: payroll.net_pay,
        month: payroll.month,
        status: payroll.status,
      });
    }
  }, [payroll]);

  // Auto-calculate net pay
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      net_pay: Number(prev.base_salary) + Number(prev.bonus) - Number(prev.deductions)
    }));
  }, [formData.base_salary, formData.bonus, formData.deductions]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/payroll/${payroll._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update payroll");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Payroll updated successfully");
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      onClose();
    },
    onError: (error: any) => toast.error(error.message),
  });

  if (!payroll) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payroll for {payroll.employee_name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="base_salary" className="text-right">Base Salary</Label>
            <Input
              id="base_salary"
              type="number"
              className="col-span-3"
              value={formData.base_salary}
              onChange={(e) => setFormData({ ...formData, base_salary: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bonus" className="text-right">Bonus</Label>
            <Input
              id="bonus"
              type="number"
              className="col-span-3"
              value={formData.bonus}
              onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deductions" className="text-right">Deductions</Label>
            <Input
              id="deductions"
              type="number"
              className="col-span-3"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="net_pay" className="text-right">Net Pay</Label>
            <Input
              id="net_pay"
              type="number"
              className="col-span-3"
              value={formData.net_pay}
              onChange={(e) => setFormData({ ...formData, net_pay: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="month" className="text-right">Month</Label>
            <Input
              id="month"
              className="col-span-3"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <div className="col-span-3">
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
