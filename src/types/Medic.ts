// /types/Medic.ts

export interface Medic {
    id?: number;  // Optional since it will be generated by the backend
    email: string;
    name: string;
    role?: string;
    employmentType: 'full-time' | 'part-time' | 'contract';
    specialization: string;
    phone?: string;
    address?: string;
    assignedTreatments?: string[];  // Assuming treatments are passed as strings
    workingDaysHours?: Record<string, string>;  // e.g., { Mon: '9am-5pm', Tue: '9am-5pm' }
    daysOff?: string[];  // e.g., ['Saturday', 'Sunday']
    pin?: string;  // Optional since a default can be set
  }
  