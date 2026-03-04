import { useState, useRef } from "react";
import { Plus, Trash2, Printer, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DrugLine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionDialogProps {
  patientName?: string;
  trigger?: React.ReactNode;
}

export function PrescriptionDialog({ patientName = "", trigger }: PrescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState(patientName);
  const [drugs, setDrugs] = useState<DrugLine[]>([
    { id: 1, name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const printRef = useRef<HTMLDivElement>(null);

  const addDrug = () =>
    setDrugs((prev) => [
      ...prev,
      { id: Date.now(), name: "", dosage: "", frequency: "", duration: "" },
    ]);

  const removeDrug = (id: number) =>
    setDrugs((prev) => prev.filter((d) => d.id !== id));

  const updateDrug = (id: number, field: keyof DrugLine, value: string) =>
    setDrugs((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=700,height=900");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Prescription</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a2533; background: #fff; padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0e7a8a; padding-bottom: 20px; margin-bottom: 24px; }
            .clinic-name { font-size: 22px; font-weight: 700; color: #0e7a8a; }
            .clinic-sub { font-size: 12px; color: #6b7b8e; margin-top: 4px; }
            .clinic-contact { text-align: right; font-size: 12px; color: #6b7b8e; line-height: 1.8; }
            .rx-symbol { font-size: 42px; font-weight: 700; color: #0e7a8a; margin-bottom: 8px; }
            .patient-row { display: flex; gap: 40px; margin-bottom: 28px; }
            .patient-field { flex: 1; }
            .patient-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #8a96a3; margin-bottom: 4px; }
            .patient-value { font-size: 14px; font-weight: 600; border-bottom: 1px solid #cdd5de; padding-bottom: 4px; min-width: 180px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
            th { background: #f0f8f9; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #6b7b8e; border-bottom: 1px solid #d0dbe4; }
            td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #edf1f4; vertical-align: top; }
            .num { font-weight: 700; color: #0e7a8a; font-size: 16px; }
            .footer { margin-top: 60px; display: flex; justify-content: flex-end; }
            .signature { text-align: center; }
            .sig-line { width: 180px; border-bottom: 1px solid #1a2533; margin-bottom: 6px; height: 40px; }
            .sig-label { font-size: 12px; color: #6b7b8e; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="clinic-name">🦷 DentaCare Clinic</div>
              <div class="clinic-sub">Advanced Dental Care &amp; Surgery</div>
              <div class="clinic-sub" style="margin-top:8px">Dr. Aicha — Dental Surgeon</div>
            </div>
            <div class="clinic-contact">
              📍 123 Clinic Street, Algiers<br/>
              📞 +213 555 000 111<br/>
              ✉️ contact@dentacare.dz<br/>
              🕐 Mon–Sat: 8:00 – 18:00
            </div>
          </div>

          <div class="rx-symbol">℞</div>

          <div class="patient-row">
            <div class="patient-field">
              <div class="patient-label">Patient Name</div>
              <div class="patient-value">${patient || "________________________"}</div>
            </div>
            <div class="patient-field">
              <div class="patient-label">Date</div>
              <div class="patient-value">${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              ${drugs
                .filter((d) => d.name)
                .map(
                  (d, i) => `
                <tr>
                  <td class="num">${i + 1}</td>
                  <td>${d.name}</td>
                  <td>${d.dosage}</td>
                  <td>${d.frequency}</td>
                  <td>${d.duration}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <div class="signature">
              <div class="sig-line"></div>
              <div class="sig-label">Dr. Aicha — Signature &amp; Stamp</div>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (v) setPatient(patientName);
    }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Prescription
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <span className="text-2xl font-serif text-primary">℞</span>
            New Prescription
          </DialogTitle>
        </DialogHeader>

        {/* Preview Header */}
        <div ref={printRef}>
          <div className="rounded-xl border border-border bg-primary/5 p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base font-bold text-primary">🦷 DentaCare Clinic</p>
                <p className="text-xs text-muted-foreground">Advanced Dental Care &amp; Surgery</p>
                <p className="text-xs text-muted-foreground mt-1">Dr. Aicha — Dental Surgeon</p>
              </div>
              <div className="text-right text-xs text-muted-foreground space-y-0.5">
                <p>📍 123 Clinic Street, Algiers</p>
                <p>📞 +213 555 000 111</p>
                <p>🕐 Mon–Sat: 8:00 – 18:00</p>
              </div>
            </div>
          </div>

          {/* Patient & Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Patient Name</label>
              <Input
                placeholder="Enter patient name"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Date</label>
              <Input value={today} readOnly className="bg-muted/50 text-muted-foreground cursor-default" />
            </div>
          </div>

          {/* Drug lines */}
          <div className="space-y-2 mb-3">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 px-1">
              {["Medication", "Dosage", "Frequency", "Duration", ""].map((h) => (
                <p key={h} className="text-xs font-medium text-muted-foreground">{h}</p>
              ))}
            </div>
            {drugs.map((drug, idx) => (
              <div key={drug.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary w-4 shrink-0">{idx + 1}.</span>
                  <Input
                    placeholder="e.g. Amoxicillin"
                    value={drug.name}
                    onChange={(e) => updateDrug(drug.id, "name", e.target.value)}
                  />
                </div>
                <Input
                  placeholder="500mg"
                  value={drug.dosage}
                  onChange={(e) => updateDrug(drug.id, "dosage", e.target.value)}
                />
                <Input
                  placeholder="3×/day"
                  value={drug.frequency}
                  onChange={(e) => updateDrug(drug.id, "frequency", e.target.value)}
                />
                <Input
                  placeholder="7 days"
                  value={drug.duration}
                  onChange={(e) => updateDrug(drug.id, "duration", e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-9 w-9"
                  onClick={() => removeDrug(drug.id)}
                  disabled={drugs.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="gap-1.5 mb-4" onClick={addDrug}>
            <Plus className="h-3.5 w-3.5" />
            Add Medication
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="gap-2 shadow-[var(--shadow-primary)]" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print Prescription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
