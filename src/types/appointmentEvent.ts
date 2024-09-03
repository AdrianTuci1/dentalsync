// types.ts
export interface Appointment {
  id: string;
  patientName: string;
  patientImage: string;
  email: string;
  phone: string;
  medicName: string;
  medicColor: string;
  treatmentType: string;
  reason: string;
  diagnosis: string;
  preferredPharmacy: string[];
  bookingDate: string;
  appointmentType: string;
  planningSchedule: { time: string; description: string; doctor: string; assistant: string; room: string }[];
  date: Date; 
  startHour: number; // Use 24-hour format, e.g., 13 for 1 PM
  endHour:number;
  status: 'waiting' | 'in-progress' | 'done';
}
