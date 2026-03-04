export interface Visit {
  id: string;
  date: string;
  type: string;
  diagnosis: string;
  treatment: string;
  dentist: string;
  cost: number;
  notes: string;
  status: "Completed" | "In Progress" | "Scheduled";
}

export interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  notes: string;
  status: string;
  lastVisit: string;
  bloodType?: string;
  address?: string;
  emergencyContact?: string;
  allergies?: string;
  visits?: Visit[];
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: "34",
    gender: "Female",
    phone: "+1 (555) 234-5678",
    email: "sarah@email.com",
    notes: "Regular check-up, sensitive teeth",
    status: "Active",
    lastVisit: "Feb 28, 2026",
    bloodType: "A+",
    address: "123 Maple St, New York, NY 10001",
    emergencyContact: "Tom Johnson — +1 (555) 234-9999",
    allergies: "Penicillin",
    visits: [
      {
        id: "v1",
        date: "Feb 28, 2026",
        type: "Routine Checkup",
        diagnosis: "Mild sensitivity on upper molars",
        treatment: "Fluoride treatment applied, sensitivity toothpaste recommended",
        dentist: "Dr. Aicha",
        cost: 120,
        notes: "Patient reports sensitivity to cold drinks for 3 months.",
        status: "Completed",
      },
      {
        id: "v2",
        date: "Aug 15, 2025",
        type: "Cleaning",
        diagnosis: "Mild tartar buildup",
        treatment: "Professional cleaning (scaling & polishing)",
        dentist: "Dr. Aicha",
        cost: 90,
        notes: "Recommend flossing daily.",
        status: "Completed",
      },
      {
        id: "v3",
        date: "Jan 10, 2025",
        type: "X-Ray & Exam",
        diagnosis: "No cavities detected",
        treatment: "Routine X-ray, full oral exam",
        dentist: "Dr. Aicha",
        cost: 150,
        notes: "All clear, schedule next visit in 6 months.",
        status: "Completed",
      },
    ],
  },
  {
    id: "2",
    name: "Michael Torres",
    age: "45",
    gender: "Male",
    phone: "+1 (555) 876-5432",
    email: "michael@email.com",
    notes: "Root canal treatment needed",
    status: "Treatment",
    lastVisit: "Mar 1, 2026",
    bloodType: "O+",
    address: "456 Oak Ave, Chicago, IL 60601",
    emergencyContact: "Maria Torres — +1 (555) 876-1111",
    allergies: "None known",
    visits: [
      {
        id: "v4",
        date: "Mar 1, 2026",
        type: "Root Canal",
        diagnosis: "Infected pulp — tooth #19",
        treatment: "Root canal therapy initiated (session 1 of 2)",
        dentist: "Dr. Aicha",
        cost: 850,
        notes: "Patient under local anesthesia. Second session in 2 weeks.",
        status: "In Progress",
      },
      {
        id: "v5",
        date: "Feb 20, 2026",
        type: "Emergency",
        diagnosis: "Severe tooth pain, abscess suspected",
        treatment: "Antibiotics prescribed, X-ray taken",
        dentist: "Dr. Aicha",
        cost: 200,
        notes: "Urgent — scheduled root canal as follow-up.",
        status: "Completed",
      },
    ],
  },
  {
    id: "3",
    name: "Emily Chen",
    age: "28",
    gender: "Female",
    phone: "+1 (555) 543-2109",
    email: "emily@email.com",
    notes: "Braces consultation",
    status: "Active",
    lastVisit: "Feb 20, 2026",
    bloodType: "B-",
    address: "789 Pine Rd, San Francisco, CA 94102",
    emergencyContact: "Wei Chen — +1 (555) 543-8888",
    allergies: "Latex",
    visits: [
      {
        id: "v6",
        date: "Feb 20, 2026",
        type: "Orthodontic Consultation",
        diagnosis: "Mild crowding, overbite",
        treatment: "Braces treatment plan discussed (18-month estimated)",
        dentist: "Dr. Aicha",
        cost: 0,
        notes: "Patient considering clear aligners vs traditional braces.",
        status: "Completed",
      },
    ],
  },
  {
    id: "4",
    name: "James Williams",
    age: "52",
    gender: "Male",
    phone: "+1 (555) 321-0987",
    email: "james@email.com",
    notes: "Dental implant follow-up",
    status: "Follow-up",
    lastVisit: "Jan 15, 2026",
    bloodType: "AB+",
    address: "321 Elm St, Houston, TX 77001",
    emergencyContact: "Linda Williams — +1 (555) 321-2222",
    allergies: "Aspirin",
    visits: [
      {
        id: "v7",
        date: "Jan 15, 2026",
        type: "Implant Follow-up",
        diagnosis: "Osseointegration progressing well",
        treatment: "Post-implant checkup, X-ray confirmation",
        dentist: "Dr. Aicha",
        cost: 200,
        notes: "Crown placement scheduled in 3 months.",
        status: "Completed",
      },
      {
        id: "v8",
        date: "Sep 5, 2025",
        type: "Implant Surgery",
        diagnosis: "Missing tooth #14 — implant placement",
        treatment: "Titanium implant placed under local anesthesia",
        dentist: "Dr. Aicha",
        cost: 2400,
        notes: "Post-op instructions given. No smoking for 2 weeks.",
        status: "Completed",
      },
    ],
  },
  {
    id: "5",
    name: "Aisha Patel",
    age: "31",
    gender: "Female",
    phone: "+1 (555) 109-8765",
    email: "aisha@email.com",
    notes: "Teeth whitening",
    status: "Active",
    lastVisit: "Feb 10, 2026",
    bloodType: "A-",
    address: "654 Birch Blvd, Miami, FL 33101",
    emergencyContact: "Raj Patel — +1 (555) 109-7777",
    allergies: "None known",
    visits: [
      {
        id: "v9",
        date: "Feb 10, 2026",
        type: "Cosmetic Whitening",
        diagnosis: "Surface staining from coffee",
        treatment: "In-office whitening (Zoom! system)",
        dentist: "Dr. Aicha",
        cost: 450,
        notes: "2-3 shades lighter achieved. Home kit provided.",
        status: "Completed",
      },
    ],
  },
];
