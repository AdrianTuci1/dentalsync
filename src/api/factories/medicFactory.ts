import MedicService from "@/api/services/medicService";
import { ApiMedicData, MedicInfo, MedicsListItem } from "@/features/clinic/types/Medic";

export const createMedicFactory = (token: string, clinicDb: string) => {
  // Use the singleton instance
  const service = MedicService.getInstance(token, clinicDb);

  return {
    fetchMedics: async (): Promise<MedicsListItem[]> => service.fetchMedics(),
    fetchMedicById: async (id: string): Promise<ApiMedicData> => service.fetchMedicById(id),
    createMedic: async (medic: Partial<MedicInfo>): Promise<MedicInfo> => service.createMedic(medic),
    updateMedic: async (id: string, medic: Partial<MedicInfo>): Promise<MedicInfo> =>
      service.updateMedic(id, medic),
    deleteMedic: async (id: string): Promise<void> => service.deleteMedic(id),
  };
};