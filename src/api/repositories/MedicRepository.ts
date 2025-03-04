import store from "@/shared/services/store"; // Import store to access dispatch
import {
  fetchMedics,
  fetchMedicById,
  createMedic,
  updateMedic,
  deleteMedic,
  setUpdatedMedicInTable,
} from "@/api/slices/medicSlice";

export class MedicRepository {
  // ✅ Fetch Medics (Paginated) & Dispatch to Redux
  async loadMedics(name = "", offset = 0) {
    console.log(`📡 Fetching medics (Offset: ${offset})`);
    await store.dispatch(fetchMedics({ name, offset }) as any);
  }

  // ✅ Fetch a Single Medic by ID & Dispatch to Redux
  async loadMedicById(id: string) {
    console.log(`🔎 Fetching medic ID: ${id}`);
    await store.dispatch(fetchMedicById(id) as any);
  }

  // ✅ Create a Medic & Dispatch to Redux
  async addMedic(medic: any) {
    console.log(`🆕 Creating medic`);
    const newMedic = await store.dispatch(createMedic(medic) as any);
    if (newMedic.payload) {
      store.dispatch(setUpdatedMedicInTable(newMedic.payload)); // ✅ Ensure immediate UI update
    }
  }

  // ✅ Update a Medic & Dispatch to Redux
  async modifyMedic(id: string, medic: any) {
    console.log(`✏️ Updating medic ID: ${id}`);
    const updatedMedic = await store.dispatch(updateMedic({ id, medic }) as any);
    if (updatedMedic.payload) {
      store.dispatch(setUpdatedMedicInTable(updatedMedic.payload)); // ✅ Ensure immediate UI update
    }
  }

  // ✅ Delete a Medic & Dispatch to Redux
  async removeMedic(id: string) {
    console.log(`🗑️ Deleting medic ID: ${id}`);
    await store.dispatch(deleteMedic(id) as any);
  }
}