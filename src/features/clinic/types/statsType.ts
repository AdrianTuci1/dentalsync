// Define the types for the stats
export interface ClinicStatsData {
    totalPatients: number;
    interventions: number;
    staffMembers: number;
    appointments: number;
  }
  
export interface ClinicVisitsData {
    male: number[];
    female: number[];
    months: string[];
  }
  
export interface ClinicPatientsData {
    male: number[];
    female: number[];
    days: string[];
  }
  
export interface Appointment {
    name: string;
    image: string;
    gender: string;
    date: string;
    time: string;
    action: string;
  }
  
export interface Review {
    medic: string;
    image: string;
    rating: number;
    patients: number;
  }
  