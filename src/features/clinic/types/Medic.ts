// Medic.ts

export interface MedicsListItem {
  id: string;
  name: string;
  specialty: string;
  contact: string;
  email: string;
  workingDays: string[];
  type: 'FULL-TIME' | 'PART-TIME';
}


export interface ApiPermission {
  id: number;
  name: string;
  isEnabled: boolean;
}

export interface ApiDayOff {
  id: string;
  medicId: number;
  name: string;
  startDate: string;
  endDate: string;
  repeatYearly: boolean;
}

export interface ApiWorkingDayHour {
  id: number;
  medicId: number;
  day: string;
  startTime: string;
  endTime: string;
}

export interface ApiMedicProfile {
  id: number;
  employmentType: string;
  specialization: string;
  phone: string;
  address: string;
  assignedTreatments: string[];
  workingDaysHours: ApiWorkingDayHour[];
  daysOff: ApiDayOff[];
}

export interface ApiMedicData {
  id: number;
  email: string;
  name: string;
  role: string;
  subaccount_of: number;
  photo: string;
  medicProfile: ApiMedicProfile;
  permissions?: [];
}


// MedicDrawer.tsx

export interface DayOff {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  repeatYearly: boolean;
}

export interface MedicInfo {
  id?: string;
  info: {
    name: string;
    email: string;
    employmentType: string;
    specialization: string;
    phone: string;
    address: string;
    photo: string;
  };
  assignedServices: {
    assignedTreatments: string[];
  };
  workingHours: {
    [day: string]: string;
  };
  daysOff: DayOff[];
  permissions: [];
}
