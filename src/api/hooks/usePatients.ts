// src/api/hooks/usePatients.ts
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "@/api/slices/patientUserSlice";

import { getSubdomain } from "@/shared/utils/getSubdomains";
import { AppDispatch, RootState } from "@/shared/services/store";

const usePatients = (searchTerm: string = "") => {
  const dispatch = useDispatch<AppDispatch>();

  // Select patient data from Redux.
  const patients = useSelector((state: RootState) => state.patients.patientsList);
  const loading = useSelector((state: RootState) => state.patients.loading);
  const error = useSelector((state: RootState) => state.patients.error);
  const offset = useSelector((state: RootState) => state.patients.offset);

  // Get authentication details.
  const token = useSelector((state: RootState) => state.auth.subaccountToken);
  const clinicDb = `${getSubdomain()}_db`;

  // Fetch patients on mount and when the search term changes.
  useEffect(() => {
    if (token && clinicDb) {
      dispatch(fetchPatients({ token, clinicDb, name: searchTerm, offset: 0 }) as any);
    }
  }, [dispatch, token, clinicDb, searchTerm]);

  // Define loadMore using the current offset from Redux.
  const loadMore = useCallback(() => {
    if (token && clinicDb && !loading) {
      dispatch(fetchPatients({ token, clinicDb, name: searchTerm, offset }) as any);
    }
  }, [dispatch, token, clinicDb, searchTerm, offset, loading]);

  return { patients, loading, error, loadMore };
};

export default usePatients;