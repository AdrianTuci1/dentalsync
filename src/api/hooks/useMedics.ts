import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { MedicRepository } from "@/api/repositories/MedicRepository";
import { RootState } from "@/shared/services/store";
import { MedicState } from "@/api/slices/medicSlice"; // Import state type

const useMedics = (searchTerm: string = "", offset: number = 0) => {
  const medicRepository = new MedicRepository();

  // ✅ Explicitly assert state type to `MedicState`
  const { medicsList, loading, error } = useSelector(
    (state: RootState) => state.medics as MedicState
  ) || { medics: [], loading: false, error: null };

  // ✅ Fetch Medics on Mount/Search Change
  useEffect(() => {
    medicRepository.loadMedics(searchTerm, 0); // Fetch from the beginning
  }, [searchTerm]);

  // ✅ Load More Medics (Pagination)
  const loadMore = useCallback(() => {
    if (!loading) {
      medicRepository.loadMedics(searchTerm, offset);
    }
  }, [searchTerm, offset, loading]);

  return { medics: medicsList ?? [], loading: loading ?? false, error: error ?? null, loadMore };
};

export default useMedics;