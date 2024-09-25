// types/appointmentEvent.ts
export interface Appointment {
  id: number;
  date: string; // YYYY-MM-DD
  startHour: string; // HH:MM:SS
  endHour: string; // HH:MM:SS
  medicId: number;
  medicName: string;
  patientId: number;
  patientName: string;
  patientImage?: string; // Optional
  details?: string;
  treatment: string;
  involvedTeeth?: string[];
  prescription?: string;
  price: number;
  paid: boolean;
  status: 'done' | 'not done' | 'not paid' | 'missed' | 'upcoming';
  color: string; // HEX or any valid CSS color
}
