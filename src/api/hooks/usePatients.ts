import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { PatientRepository } from "@/api/repositories/PatientRepository";
import { RootState } from "@/shared/services/store";

const usePatients = (searchTerm: string = "") => {
  // Instantiate repository
  const patientRepository = new PatientRepository();

  // Select patient data from Redux.
  const patients = useSelector((state: RootState) => state.patients.patientsList);
  const loading = useSelector((state: RootState) => state.patients.loading);
  const error = useSelector((state: RootState) => state.patients.error);
  const offset = useSelector((state: RootState) => state.patients.offset);

  // Fetch patients on mount and when the search term changes.
  useEffect(() => {
    patientRepository.loadPatients(searchTerm, 0);
  }, [searchTerm]);

  // Define loadMore using the current offset from Redux.
  const loadMore = useCallback(() => {
    if (!loading) {
      patientRepository.loadPatients(searchTerm, offset);
    }
  }, [searchTerm, offset, loading]);

  return { patients, loading, error, loadMore };
};

export default usePatients;