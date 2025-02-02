import TreatmentService from "@/api/treatmentService";
import { Treatment } from "@/features/clinic/types/treatmentType";

export const createTreatmentFactory = (token: string, clinicDb: string) => {
  // Use the singleton getter to obtain the service instance.
  const service = TreatmentService.getInstance(token, clinicDb);

  return {
    fetchTreatments: async (name: string = "") => service.getAllTreatments(name),
    createTreatment: async (treatment: Partial<Treatment>) =>
      service.createTreatment(treatment),
    updateTreatment: async (id: string, treatment: Partial<Treatment>) =>
      service.updateTreatment(id, treatment),
    deleteTreatment: async (id: string) => service.deleteTreatment(id),
  };
};