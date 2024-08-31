// types.ts
export interface Appointment {
  id: string;
  patientName: string;
  patientImage: string;
  email: string;
  phone: string;
  medicName: string;
  treatmentType: string;
  reason: string;
  diagnosis: string;
  preferredPharmacy: string[];
  bookingDate: string;
  appointmentType: string;
  planningSchedule: { time: string; description: string; doctor: string; assistant: string; room: string }[];
  day: number; // 0 for Sunday, 1 for Monday, etc.
  startHour: number; // Use 24-hour format, e.g., 13 for 1 PM
  endHour:number;
}
