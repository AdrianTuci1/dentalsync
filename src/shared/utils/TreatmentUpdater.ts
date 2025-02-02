// src/facades/TreatmentUpdater.ts
import { Treatment } from "@/features/clinic/types/treatmentType";

export class TreatmentUpdater {
  /**
   * Merges a partial update into the existing treatments array.
   * @param existingTreatments - The current list of treatments.
   * @param id - The ID of the treatment to update.
   * @param partialUpdate - The changes to apply.
   * @returns An updated array of treatments.
   */
  public static mergeTreatment(
    existingTreatments: Treatment[],
    id: string,
    partialUpdate: Partial<Treatment>
  ): Treatment[] {
    return existingTreatments.map((t) =>
      t.id === id ? { ...t, ...partialUpdate, updatedAt: new Date().toISOString() } : t
    );
  }
}