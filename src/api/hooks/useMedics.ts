// src/api/hooks/useMedics.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedics } from "@/api/slices/medicSlice";
import { getSubdomain } from "@/shared/utils/getSubdomains";
import { AppDispatch, RootState } from "@/shared/services/store";

const useMedics = (searchTerm: string = "", offset: number = 0) => {
  const dispatch = useDispatch<AppDispatch>();

  const medics = useSelector((state: RootState) => state.medics.medics);
  const loading = useSelector((state: RootState) => state.medics.loading);
  const error = useSelector((state: RootState) => state.medics.error);

  const token = useSelector((state: RootState) => state.auth.subaccountToken);
  const clinicDb = `${getSubdomain()}_db`;

  useEffect(() => {
    if (token && clinicDb) {
      dispatch(fetchMedics({ token, clinicDb, name: searchTerm, offset }) as any);
    }
  }, [dispatch, token, clinicDb, searchTerm, offset]);

  return { medics, loading, error };
};

export default useMedics;