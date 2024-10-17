// types/patient.ts

export interface PatientProfile {
    id: number;
    age: number;
    gender: string;
    phone: string;
    email: string;
    address: string;
    labels: string[];
    notes: string;
    dentalHistory: Record<string, any>;
    files: string[];
    paymentsMade: any[];
}

export interface Patient {
    id: number;
    name: string;
    email: string;
    photo: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    patientProfile: PatientProfile;
}
