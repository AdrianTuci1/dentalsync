import PatientService from "@/api/patientService";

export const createPatientFactory = (token: string, clinicDb: string) => {
  const service = PatientService.getInstance(token, clinicDb); // ✅ Singleton pattern

  return {
    // ✅ Fetch paginated patients for the table
    fetchPatients: async (name: string = "", offset: number = 0): Promise<any[]> =>
      service.getPatients(name, offset),

    // ✅ Fetch a detailed patient record (Drawer)
    fetchPatientById: async (id: string): Promise<any | null> => service.getPatient(id),

    // ✅ Create a new patient
    createPatient: async (patient: Partial<any>): Promise<any> => service.createPatient(patient),

    // ✅ Update an existing patient
    updatePatient: async (id: string, patient: Partial<any>): Promise<any> =>
      service.updatePatient(id, patient),

    // ✅ Delete a patient
    deletePatient: async (id: string): Promise<void> => service.deletePatient(id),
  };
};