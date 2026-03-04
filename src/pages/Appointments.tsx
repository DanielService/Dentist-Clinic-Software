import { useState, useMemo } from "react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from "date-fns";
import {
  Calendar, Clock, Plus, ChevronLeft, ChevronRight,
  User, CheckCircle2, XCircle, AlertCircle, CalendarClock,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INITIAL_APPOINTMENTS, type Appointment, type AppointmentStatus, APPOINTMENT_TYPES } from "@/data/appointments";
import { INITIAL_PATIENTS } from "@/data/patients";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const statusConfig: Record<AppointmentStatus, { label: string; color: string; icon: React.ReactNode }> = {
  Scheduled: {
    label: "Scheduled",
    color: "bg-primary-light text-primary border-primary/20",
    icon: <CalendarClock className="h-3.5 w-3.5" />,
  },
  Completed: {
    label: "Completed",
    color: "bg-success-light text-success border-success/20",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  "No Show": {
    label: "No Show",
    color: "bg-warning-light text-warning border-warning/20",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
};

function generateId() {
  return "a" + Date.now().toString(36);
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-03-04"));
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date("2026-03-01"));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // New appointment form state
  const [form, setForm] = useState({
    patientId: "",
    date: undefined as Date | undefined,
    time: "09:00",
    type: "" as string,
    notes: "",
  });

  const dayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => isSameDay(parseISO(a.date), selectedDate))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDate]
  );

  // Days in current calendar month that have appointments
  const daysWithAppointments = useMemo(() => {
    const days = eachDayOfInterval({ start: startOfMonth(calendarMonth), end: endOfMonth(calendarMonth) });
    return days.filter((day) => appointments.some((a) => isSameDay(parseISO(a.date), day)));
  }, [appointments, calendarMonth]);

  function handleAddAppointment() {
    if (!form.patientId || !form.date || !form.type) return;
    const patient = INITIAL_PATIENTS.find((p) => p.id === form.patientId);
    if (!patient) return;

    const newAppt: Appointment = {
      id: generateId(),
      patientId: form.patientId,
      patientName: patient.name,
      date: format(form.date, "yyyy-MM-dd"),
      time: form.time,
      type: form.type as Appointment["type"],
      status: "Scheduled",
      notes: form.notes,
      dentist: "Dr. Aicha",
    };
    setAppointments((prev) => [...prev, newAppt]);
    setSelectedDate(form.date);
    setForm({ patientId: "", date: undefined, time: "09:00", type: "", notes: "" });
    setDialogOpen(false);
  }

  function handleStatusChange(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  const todayCount = appointments.filter((a) => isToday(parseISO(a.date)) && a.status === "Scheduled").length;
  const scheduledCount = appointments.filter((a) => a.status === "Scheduled").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  // Mini calendar grid
  const firstDayOfMonth = getDay(startOfMonth(calendarMonth));
  const daysInMonth = eachDayOfInterval({ start: startOfMonth(calendarMonth), end: endOfMonth(calendarMonth) });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10 shadow-[var(--shadow-card)]">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                <div>
                  <h1 className="text-sm font-bold text-foreground">Appointments</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Manage your schedule</p>
                </div>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-[var(--shadow-primary)]" size="sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Appointment</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    {/* Patient */}
                    <div className="space-y-1.5">
                      <Label>Patient</Label>
                      <Select value={form.patientId} onValueChange={(v) => setForm((f) => ({ ...f, patientId: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {INITIAL_PATIENTS.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                      <Label>Date</Label>
                      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !form.date && "text-muted-foreground")}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {form.date ? format(form.date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarPicker
                            mode="single"
                            selected={form.date}
                            onSelect={(d) => { setForm((f) => ({ ...f, date: d })); setPickerOpen(false); }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time */}
                    <div className="space-y-1.5">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={form.time}
                        onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                      <Label>Appointment Type</Label>
                      <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {APPOINTMENT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input
                        placeholder="Additional notes..."
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      />
                    </div>

                    <Button
                      className="w-full shadow-[var(--shadow-primary)]"
                      onClick={handleAddAppointment}
                      disabled={!form.patientId || !form.date || !form.type}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 max-w-7xl w-full mx-auto space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Today", value: todayCount, color: "text-primary bg-primary-light", icon: Calendar },
                { label: "Scheduled", value: scheduledCount, color: "text-warning bg-warning-light", icon: CalendarClock },
                { label: "Completed", value: completedCount, color: "text-success bg-success-light", icon: CheckCircle2 },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold text-foreground">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[320px,1fr] gap-6">

              {/* Mini Calendar */}
              <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-5 space-y-4 h-fit">
                {/* Month nav */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">{format(calendarMonth, "MMMM yyyy")}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</span>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-y-1">
                  {/* Empty cells before first day */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {daysInMonth.map((day) => {
                    const hasAppt = daysWithAppointments.some((d) => isSameDay(d, day));
                    const isSelected = isSameDay(day, selectedDate);
                    const todayDay = isToday(day);
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "relative h-9 w-full rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center",
                          isSelected && "bg-primary text-primary-foreground shadow-[var(--shadow-primary)]",
                          !isSelected && todayDay && "text-primary font-bold",
                          !isSelected && !todayDay && "text-foreground hover:bg-muted",
                        )}
                      >
                        {format(day, "d")}
                        {hasAppt && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                        )}
                        {hasAppt && isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                  Has appointments
                </div>
              </div>

              {/* Day Schedule */}
              <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] flex flex-col min-h-[400px]">
                <div className="p-5 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">
                    {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")},{" "}
                    <span className="text-muted-foreground font-normal">{format(selectedDate, "MMMM d, yyyy")}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex-1 divide-y divide-border overflow-y-auto">
                  {dayAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
                      <Calendar className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No appointments for this day</p>
                      <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)} className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Book one
                      </Button>
                    </div>
                  ) : (
                    dayAppointments.map((appt) => (
                      <AppointmentRow key={appt.id} appt={appt} onStatusChange={handleStatusChange} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppointmentRow({
  appt,
  onStatusChange,
}: {
  appt: Appointment;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  const cfg = statusConfig[appt.status];

  return (
    <div className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
      {/* Time */}
      <div className="w-14 shrink-0 text-center">
        <p className="text-sm font-bold text-foreground">{appt.time}</p>
        <Clock className="h-3 w-3 text-muted-foreground mx-auto mt-0.5" />
      </div>

      {/* Color bar */}
      <div className={cn("w-1 self-stretch rounded-full shrink-0",
        appt.status === "Scheduled" ? "bg-primary" :
        appt.status === "Completed" ? "bg-success" :
        appt.status === "Cancelled" ? "bg-destructive" : "bg-warning"
      )} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground">{appt.patientName}</p>
          <Badge variant="outline" className={cn("text-xs gap-1", cfg.color)}>
            {cfg.icon}{cfg.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{appt.type}</p>
        {appt.notes && <p className="text-xs text-muted-foreground italic mt-0.5 truncate">{appt.notes}</p>}
      </div>

      {/* Status actions */}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Select value={appt.status} onValueChange={(v) => onStatusChange(appt.id, v as AppointmentStatus)}>
          <SelectTrigger className="h-8 text-xs w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(["Scheduled", "Completed", "Cancelled", "No Show"] as AppointmentStatus[]).map((s) => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
