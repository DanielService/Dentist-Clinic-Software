import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Search, Phone, Mail, MoreHorizontal, Filter,
  ArrowUpDown, UserPlus
} from "lucide-react";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { INITIAL_PATIENTS, type Patient } from "@/data/patients";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10 shadow-[var(--shadow-card)]">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                <h1 className="text-lg font-bold text-foreground">Patients Database</h1>
              </div>
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

          <main className="flex-1 px-6 py-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
                <p className="text-muted-foreground">Manage and view all your patient records in one place.</p>
              </div>
              <div className="flex items-center gap-3">
                <AddPatientDialog onAddPatient={(p) => setPatients(prev => [p, ...prev])} />
              </div>
            </div>

            {/* toolbar */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 h-10 w-full"
                  placeholder="Search by name, phone or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 gap-2 flex-1 md:flex-none">
                      <Filter className="h-4 w-4" />
                      {statusFilter || "All Status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Patients</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Treatment")}>Under Treatment</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Follow-up")}>Follow-up</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" className="h-10 gap-2 flex-1 md:flex-none">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>

            {/* Patient List */}
            <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left bg-muted/30">
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Details</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-10 w-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground font-medium">No patients found</p>
                            <p className="text-xs text-muted-foreground">Adjust your search or filter to find what you're looking for.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((patient, i) => (
                        <tr
                          key={patient.id}
                          className="hover:bg-muted/40 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
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
                                <Phone className="h-3.5 w-3.5 text-primary/60" />{patient.phone}
                              </div>
                              {patient.email && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Mail className="h-3.5 w-3.5 text-primary/60" />{patient.email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{patient.lastVisit}</td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium px-2.5 py-0.5 ${statusStyles[patient.status] ?? ""}`}
                            >
                              {patient.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/patients/${patient.id}`)}>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Patient</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-border">
                {filtered.length === 0 ? (
                  <div className="px-6 py-20 text-center">
                    <p className="text-muted-foreground text-sm">No patients found.</p>
                  </div>
                ) : filtered.map((patient, i) => (
                  <div
                    key={patient.id}
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                      {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm">{patient.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {patient.phone}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0 ${statusStyles[patient.status] ?? ""}`}>
                          {patient.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{patient.lastVisit}</span>
                      </div>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
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
