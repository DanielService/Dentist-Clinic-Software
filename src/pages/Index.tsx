import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Calendar, Clock, TrendingUp,
  Search, Phone, Mail, MoreHorizontal
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { INITIAL_PATIENTS, type Patient } from "@/data/patients";


const statusStyles: Record<string, string> = {
  Active: "bg-success-light text-success border-success/20",
  Treatment: "bg-primary-light text-primary border-primary/20",
  "Follow-up": "bg-warning-light text-warning border-warning/20",
};

const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-success text-success-foreground",
  "bg-warning text-warning-foreground",
  "bg-accent-foreground text-accent",
];

export default function Index() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10 shadow-[var(--shadow-card)]">
            <div className="px-4 py-3 flex items-center justify-between">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary font-semibold text-xs">
                  DR
                </div>
                <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground leading-tight">Dr. Aicha</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-6 text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="relative z-10">
            <p className="text-primary-foreground/80 text-sm font-medium mb-1">Good morning 👋</p>
            <h2 className="text-2xl font-bold mb-1">Welcome back, Dr. Aicha</h2>
            <p className="text-primary-foreground/70 text-sm">You have <span className="font-semibold text-primary-foreground">8 appointments</span> scheduled today.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden md:block">
            <svg viewBox="0 0 24 24" className="h-32 w-32 text-primary-foreground" fill="currentColor">
              <path d="M12 2C9.5 2 8 4 8 6c0 1.5.5 2.5 1 3.5L8 17c0 1.5 1 3 2 3s2-1.5 2-1.5S13.5 20 14 20c1 0 2-1.5 2-3l-1-7.5C15.5 8.5 16 7.5 16 6c0-2-1.5-4-4-4z" />
            </svg>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Patients"
            value={patients.length}
            subtitle="+3 this week"
            icon={Users}
          />
          <StatsCard
            title="Today's Appts"
            value={8}
            subtitle="2 pending"
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="In Treatment"
            value={patients.filter(p => p.status === "Treatment").length}
            subtitle="Ongoing cases"
            icon={Clock}
            variant="success"
          />
          <StatsCard
            title="Follow-ups"
            value={patients.filter(p => p.status === "Follow-up").length}
            subtitle="Due this week"
            icon={TrendingUp}
            variant="warning"
          />
        </div>

        {/* Patient List */}
        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)]">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Patients</h3>
              <p className="text-sm text-muted-foreground">{patients.length} registered patients</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search patients..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <AddPatientDialog onAddPatient={(p) => setPatients(prev => [p, ...prev])} />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Visit</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No patients found.
                    </td>
                  </tr>
                ) : filtered.map((patient, i) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-muted/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.age} yrs · {patient.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />{patient.phone}
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />{patient.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.lastVisit}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${statusStyles[patient.status] ?? ""}`}
                      >
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {filtered.length === 0 ? (
              <p className="px-6 py-10 text-center text-muted-foreground text-sm">No patients found.</p>
            ) : filtered.map((patient, i) => (
              <div
                key={patient.id}
                className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.phone}</p>
                </div>
                <Badge variant="outline" className={`text-xs shrink-0 ${statusStyles[patient.status] ?? ""}`}>
                  {patient.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
