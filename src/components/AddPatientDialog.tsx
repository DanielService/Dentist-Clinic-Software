import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  notes: string;
  status: string;
  lastVisit: string;
}

interface AddPatientDialogProps {
  onAddPatient: (patient: Patient) => void;
}

export function AddPatientDialog({ onAddPatient }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.gender) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...form,
      status: "Active",
      lastVisit: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    onAddPatient(newPatient);
    toast({ title: "Patient added successfully!", description: `${form.name} has been registered.` });
    setForm({ name: "", age: "", gender: "", phone: "", email: "", notes: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-[var(--shadow-primary)]">
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary">
              <UserPlus className="h-4 w-4" />
            </span>
            New Patient Registration
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g. 32"
                value={form.age}
                onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
              <Select value={form.gender} onValueChange={v => setForm(p => ({ ...p, gender: v }))}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="notes">Notes / Chief Complaint</Label>
              <Textarea
                id="notes"
                placeholder="Any dental issues, allergies, or notes..."
                className="resize-none"
                rows={3}
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Register Patient
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
