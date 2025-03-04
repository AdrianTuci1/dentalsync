import store from "@/shared/services/store"; // Import store to access dispatch
import {
  fetchPatients,
  fetchPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  addOptimisticPatient,
  updateOptimisticPatient,
  deleteOptimisticPatient,
  setDetailedPatient,
} from "@/api/slices/patientUserSlice";
import { Patient } from "@/api/slices/patientUserSlice"; // Import type

export class PatientRepository {
  // ✅ Fetch Patients (Paginated) & Dispatch to Redux
  async loadPatients(name = "", offset = 0) {
    await store.dispatch(fetchPatients({name, offset}) as any);
  }

  // ✅ Fetch a Single Patient by ID & Dispatch to Redux
  async loadPatientById(id: string) {
    await store.dispatch(fetchPatientById(id) as any);
  }

  // ✅ Create a Patient & Dispatch to Redux (with Optimistic Update)
  async addPatient(patient: Partial<Patient>) {
    
    // Optimistic Update - Add temporary entry before server response
    store.dispatch(addOptimisticPatient(patient));

    await store.dispatch(createPatient({ patient }) as any);
  }

  // ✅ Update a Patient & Dispatch to Redux (with Optimistic Update)
  async modifyPatient(id: string, patient: Partial<Patient>) {

    // Optimistic Update - Reflect changes before server response
    store.dispatch(updateOptimisticPatient({ id, patient }));

    await store.dispatch(updatePatient({ id, patient }) as any);
  }

  // ✅ Delete a Patient & Dispatch to Redux (with Optimistic Update)
  async removePatient(id: string) {

    // Optimistic Update - Remove patient before confirmation
    store.dispatch(deleteOptimisticPatient(id));

    await store.dispatch(deletePatient(id) as any);
  }

    // ✅ Set a Single Patient in Redux (Without Fetching)
  async setDetailedPatientDirectly(patient: any) {
        store.dispatch(setDetailedPatient(patient));
      }
}