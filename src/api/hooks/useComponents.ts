import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComponents, setNextOffset } from "@/api/slices/stockSlice";
import { RootState, AppDispatch } from "@/shared/services/store";

const useStocks = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Correctly fetch state
  const stocks = useSelector((state: RootState) => state.stocks.components);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);
  const offset = useSelector((state: RootState) => state.stocks.offset);

  // ✅ Fetch components when mounted
  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(fetchComponents() as any);
    }
  }, [dispatch, stocks.length]);

  // ✅ Load More Function (Handles Pagination)
  const loadMore = useCallback(() => {
    if (loading) return; // 🔹 Prevent multiple requests

    const newOffset = offset + 20; // 🔹 Increment by 20 (or API page size)

    console.log(`📡 Loading more components (Offset: ${newOffset})`);

    // 🔹 Set new offset BEFORE dispatching to prevent race conditions
    dispatch(setNextOffset(newOffset));

    dispatch(fetchComponents() as any);
  }, [dispatch, offset, loading]);

  return { stocks, loading, error, loadMore };
};

export default useStocks;