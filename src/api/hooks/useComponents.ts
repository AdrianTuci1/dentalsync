// src/api/hooks/useStocks.ts
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComponents,
} from "@/api/slices/stockSlice";
import { RootState, AppDispatch } from "@/shared/services/store";
import { getSubdomain } from "@/shared/utils/getSubdomains";

const useStocks = (searchTerm: string = "") => {
  const dispatch = useDispatch<AppDispatch>();

  // Read stocks data from Redux state.
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);
  const offset = useSelector((state: RootState) => state.stocks.offset);

  // Get authentication details.
  const token = useSelector((state: RootState) => state.auth.subaccountToken);
  const clinicDb = `${getSubdomain()}_db`;

  // Dispatch fetchComponents thunk on mount and whenever searchTerm changes (reset offset to 0).
  useEffect(() => {
    if (token && clinicDb) {
      dispatch(fetchComponents({ token, clinicDb, name: searchTerm, offset: 0 }) as any);
    }
  }, [dispatch, token, clinicDb, searchTerm]);

  // Define a loadMore function that dispatches the fetch thunk with the current offset.
  const loadMore = useCallback(() => {
    if (token && clinicDb && !loading) {
      dispatch(fetchComponents({ token, clinicDb, name: searchTerm, offset }) as any);
    }
  }, [dispatch, token, clinicDb, searchTerm, offset, loading]);

  return { stocks, loading, error, loadMore };
};

export default useStocks;