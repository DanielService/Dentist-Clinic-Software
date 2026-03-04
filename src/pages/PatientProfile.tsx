import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, MapPin, User, Heart,
  AlertTriangle, Calendar, DollarSign, Stethoscope,
  CheckCircle2, Clock, CalendarClock, Plus, FileText,
} from "lucide-react";
import { INITIAL_PATIENTS, Visit } from "@/data/patients";
import { Button } from "@/components/ui/button";
import { PrescriptionDialog } from "@/components/PrescriptionDialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-success text-success-foreground",
  "bg-warning text-warning-foreground",
  "bg-accent-foreground text-accent",
];

const statusStyles: Record<string, string> = {
  Active: "bg-success-light text-success border-success/20",
  Treatment: "bg-primary-light text-primary border-primary/20",
  "Follow-up": "bg-warning-light text-warning border-warning/20",
};

const visitStatusIcon = {
  Completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  "In Progress": <Clock className="h-4 w-4 text-primary" />,
  Scheduled: <CalendarClock className="h-4 w-4 text-warning" />,
};

const visitStatusStyle: Record<string, string> = {
  Completed: "bg-success-light text-success border-success/20",
  "In Progress": "bg-primary-light text-primary border-primary/20",
  Scheduled: "bg-warning-light text-warning border-warning/20",
};

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patients] = useState(INITIAL_PATIENTS);

  const patient = patients.find((p) => p.id === id);
  const patientIndex = patients.findIndex((p) => p.id === id);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground text-lg">Patient not found.</p>
          <Button onClick={() => navigate("/patients")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  const visits = patient.visits ?? [];
  const totalSpent = visits.reduce((s, v) => s + v.cost, 0);
  const avatarColor = AVATAR_COLORS[patientIndex % AVATAR_COLORS.length];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10 shadow-[var(--shadow-card)]">
            <div className="px-4 py-3 flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/patients")}
              >
                <ArrowLeft className="h-4 w-4" />
                Patients
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-semibold text-foreground truncate">{patient.name}</span>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 max-w-5xl w-full mx-auto space-y-6">

            {/* Profile Hero */}
            <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
              <div className="h-24 w-full" style={{ background: "var(--gradient-hero)" }} />
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                  <div className={`h-20 w-20 rounded-2xl border-4 border-card flex items-center justify-center text-2xl font-bold shrink-0 shadow-[var(--shadow-card)] ${avatarColor}`}>
                    {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 pt-2 sm:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
                      <Badge variant="outline" className={`text-xs font-medium ${statusStyles[patient.status] ?? ""}`}>
                        {patient.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {patient.age} yrs · {patient.gender} · Last visit: {patient.lastVisit}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <PrescriptionDialog
                      patientName={patient.name}
                      trigger={
                        <Button variant="outline" className="gap-2">
                          <span className="font-serif text-base leading-none">℞</span>
                          Prescription
                        </Button>
                      }
                    />
                    <Button className="gap-2 shadow-[var(--shadow-primary)]">
                      <Plus className="h-4 w-4" />
                      New Visit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Visits", value: visits.length, icon: Calendar, color: "text-primary bg-primary-light" },
                { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-success bg-success-light" },
                { label: "Treatments", value: visits.filter((v) => v.status === "In Progress").length, icon: Stethoscope, color: "text-warning bg-warning-light" },
                { label: "Last Visit", value: patient.lastVisit, icon: Clock, color: "text-primary bg-primary-light" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-sm font-bold text-foreground truncate">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="visits">
              <TabsList className="bg-muted">
                <TabsTrigger value="visits" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Visit History
                </TabsTrigger>
                <TabsTrigger value="info" className="gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Information
                </TabsTrigger>
              </TabsList>

              {/* Visit History Tab */}
              <TabsContent value="visits" className="mt-4 space-y-3">
                {visits.length === 0 ? (
                  <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground shadow-[var(--shadow-card)]">
                    No visits recorded yet.
                  </div>
                ) : (
                  visits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
                  ))
                )}
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info" className="mt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Contact */}
                  <InfoSection title="Contact Details" icon={<Phone className="h-4 w-4" />}>
                    <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={patient.phone} />
                    <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={patient.email || "—"} />
                    <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address" value={patient.address || "—"} />
                  </InfoSection>

                  {/* Medical */}
                  <InfoSection title="Medical Info" icon={<Heart className="h-4 w-4" />}>
                    <InfoRow icon={<Heart className="h-3.5 w-3.5" />} label="Blood Type" value={patient.bloodType || "—"} />
                    <InfoRow icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Allergies" value={patient.allergies || "None known"} />
                    <InfoRow icon={<User className="h-3.5 w-3.5" />} label="Emergency Contact" value={patient.emergencyContact || "—"} />
                  </InfoSection>

                  {/* Notes */}
                  <div className="sm:col-span-2 bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)]">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Clinical Notes</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{patient.notes || "No notes recorded."}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function VisitCard({ visit }: { visit: Visit }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {visitStatusIcon[visit.status]}
          <div>
            <p className="text-sm font-semibold text-foreground">{visit.type}</p>
            <p className="text-xs text-muted-foreground">{visit.date} · {visit.dentist}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {visit.cost > 0 && (
            <span className="text-sm font-semibold text-foreground">${visit.cost.toLocaleString()}</span>
          )}
          <Badge variant="outline" className={`text-xs font-medium ${visitStatusStyle[visit.status]}`}>
            {visit.status}
          </Badge>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 pt-1 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Diagnosis</p>
          <p className="text-xs text-foreground">{visit.diagnosis}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Treatment</p>
          <p className="text-xs text-foreground">{visit.treatment}</p>
        </div>
        {visit.notes && (
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground font-medium mb-0.5">Notes</p>
            <p className="text-xs text-muted-foreground italic">{visit.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)] space-y-3">
      <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
