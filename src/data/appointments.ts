export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled" | "No Show";
export type AppointmentType =
  | "Routine Checkup"
  | "Cleaning"
  | "Root Canal"
  | "Orthodontic Consultation"
  | "X-Ray & Exam"
  | "Emergency"
  | "Implant Follow-up"
  | "Implant Surgery"
  | "Cosmetic Whitening"
  | "Extraction"
  | "Other";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:mm
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  dentist: string;
}

export const APPOINTMENT_TYPES: AppointmentType[] = [
  "Routine Checkup",
  "Cleaning",
  "Root Canal",
  "Orthodontic Consultation",
  "X-Ray & Exam",
  "Emergency",
  "Implant Follow-up",
  "Implant Surgery",
  "Cosmetic Whitening",
  "Extraction",
  "Other",
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    patientId: "1",
    patientName: "Sarah Johnson",
    date: "2026-03-04",
    time: "09:00",
    type: "Routine Checkup",
    status: "Scheduled",
    notes: "Follow-up on sensitivity",
    dentist: "Dr. Aicha",
  },
  {
    id: "a2",
    patientId: "2",
    patientName: "Michael Torres",
    date: "2026-03-04",
    time: "10:30",
    type: "Root Canal",
    status: "Scheduled",
    notes: "Session 2 of 2",
    dentist: "Dr. Aicha",
  },
  {
    id: "a3",
    patientId: "3",
    patientName: "Emily Chen",
    date: "2026-03-04",
    time: "11:00",
    type: "Orthodontic Consultation",
    status: "Scheduled",
    notes: "Decision on braces vs aligners",
    dentist: "Dr. Aicha",
  },
  {
    id: "a4",
    patientId: "4",
    patientName: "James Williams",
    date: "2026-03-05",
    time: "09:30",
    type: "Implant Follow-up",
    status: "Scheduled",
    notes: "Crown placement evaluation",
    dentist: "Dr. Aicha",
  },
  {
    id: "a5",
    patientId: "5",
    patientName: "Aisha Patel",
    date: "2026-03-05",
    time: "14:00",
    type: "Cleaning",
    status: "Scheduled",
    notes: "Routine cleaning",
    dentist: "Dr. Aicha",
  },
  {
    id: "a6",
    patientId: "1",
    patientName: "Sarah Johnson",
    date: "2026-03-06",
    time: "10:00",
    type: "X-Ray & Exam",
    status: "Scheduled",
    notes: "6-month full exam",
    dentist: "Dr. Aicha",
  },
  {
    id: "a7",
    patientId: "2",
    patientName: "Michael Torres",
    date: "2026-02-20",
    time: "09:00",
    type: "Emergency",
    status: "Completed",
    notes: "Abscess treated",
    dentist: "Dr. Aicha",
  },
  {
    id: "a8",
    patientId: "5",
    patientName: "Aisha Patel",
    date: "2026-02-10",
    time: "11:30",
    type: "Cosmetic Whitening",
    status: "Completed",
    notes: "Zoom whitening completed",
    dentist: "Dr. Aicha",
  },
];
