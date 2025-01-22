export interface Doctor {
    name: string;
    color: string;
    checked: boolean;
  }
  
export interface Treatment {
    name: string;
    checked: boolean;
  }
  
export interface Patient {
    name: string;
    id: number;
  }
  
export interface State {
    availableDoctors: Doctor[];
    treatments: Treatment[];
    patientQueue: Patient[];
  }
  