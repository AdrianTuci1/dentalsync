export interface AppointmentTreatment {
  localId?: string;
  treatmentId: string;
  treatmentName: string;
  color?: string;
  units: number;
  involvedTeeth: string[];
  prescription: string;
  details: string;
}

// Define the Appointment type
export interface Appointment {
  appointmentId: string;    // ID of the appointment (e.g., 'AP0001')
  date: string;             // Date of the appointment (YYYY-MM-DD)
  time: string;             // Time of the appointment (HH:MM)
  startHour?: string;
  endHour?: string;
  isDone?: boolean;          // Whether the appointment is completed
  price?: number;            // Price of the appointment
  isPaid: boolean;          // Whether the appointment is paid
  status?: 'done' | 'upcoming' | 'missed' | 'notpaid';  // Appointment status
  color?: string;
  medicId?: number;
  medicUser: string;        // ID of the medic attending the appointment
  patientId?: number;
  patientUser: string;      // ID of the patient for the appointment
  createdAt: string;        // Timestamp when the appointment was created
  updatedAt: string;        // Timestamp when the appointment was last updated
  treatmentId?: string;
  initialTreatment?: string;  // Optional initial treatment associated with the appointment
  treatments?: AppointmentTreatment[];
}

// Define the Treatment type used in the Appointment
export interface Treatment {
  id: string;               // Treatment ID
  name: string;             // Name of the treatment (e.g., 'Teeth Cleaning')
  category: string;         // Category of the treatment (e.g., 'Cleaning')
  description: string;      // Description of the treatment
  duration: number;         // Duration of the treatment in minutes
  price: number;            // Price of the treatment
  color?: string;
  createdAt: string;        // Timestamp when the treatment was created
  updatedAt: string;        // Timestamp when the treatment was last updated
}