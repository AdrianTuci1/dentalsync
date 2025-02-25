import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Component } from '@/features/clinic/types/componentType';
import { cache } from '@/shared/utils/localForage';
import UnifiedDataService from '../services/unifiedDataService';
import { RootState } from '@/shared/services/store';

interface StockState {
  stocks: Component[];
  loading: boolean;
  error: string | null;
  offset: number;
}

const initialState: StockState = {
  stocks: [],
  loading: false,
  error: null,
  offset: 0,
};

import { getSubdomain } from '@/shared/utils/getSubdomains';

// ✅ Fetch Components with Proper Caching & Pagination
export const fetchComponents = createAsyncThunk(
  "stocks/fetch",
  async (
    { token, clinicDb, name = "", offset = 0 }: { token: string; clinicDb: string; name?: string; offset?: number },
    { rejectWithValue }
  ) => {
    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const result = await service.getResources("components", { name, offset: String(offset) });

      // ✅ Merge new data with cached data to prevent duplicate requests
      const cachedComponents = (await cache.get("components")) || [];
      const mergedComponents = [...cachedComponents, ...result.data].reduce(
        (acc, item) => acc.find((i: any) => i.id === item.id) ? acc : [...acc, item], [] as any[]
      );

      await cache.set("components", mergedComponents);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch components");
    }
  }
);

// ✅ Optimistic Component Creation (Cache Only After API)
export const createComponent = createAsyncThunk(
  "stocks/create",
  async (
    { component }: { component: Partial<Component> },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.subaccountToken || '';
      const clinicDb = getSubdomain() + '_db'
      const service = UnifiedDataService.getInstance(token, clinicDb);

      // ✅ Send API request first
      const savedComponent = await service.createResource("components", component);

      // ✅ Update cache & Redux with API-confirmed data
      const cachedComponents = (await cache.get("components")) || [];
      const finalComponents = [...cachedComponents, savedComponent];

      await cache.set("components", finalComponents);
      dispatch(setStocks(finalComponents));

      return savedComponent;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create component");
    }
  }
);

// ✅ Optimistic Component Update (Use Full API Response)
export const updateComponent = createAsyncThunk(
  "stocks/update",
  async ({ id, changes }: { id: string; changes: Partial<Component> }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.subaccountToken || '';
      const clinicDb = getSubdomain() + '_db'
      const service = UnifiedDataService.getInstance(token, clinicDb);

      // ✅ Send API request first
      const updatedComponent = await service.updateResource("components", id, changes);

      // ✅ Update cache & Redux with API-confirmed data
      const cachedComponents = (await cache.get("components")) || [];
      const finalComponents = cachedComponents.map(comp => comp.id === id ? updatedComponent : comp);

      await cache.set("components", finalComponents);
      dispatch(setStocks(finalComponents));

      return updatedComponent;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update component");
    }
  }
);

// ✅ Optimistic Component Deletion (Fix: Proper Token Handling)
export const deleteComponent = createAsyncThunk(
  "stocks/delete",
  async ({ id }: { id: string }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.subaccountToken || '';
      const clinicDb = getSubdomain() + '_db'
      const service = UnifiedDataService.getInstance(token, clinicDb);

      await service.deleteResource("components", id);

      // ✅ Remove from cache & Redux after API success
      const cachedComponents = (await cache.get("components")) || [];
      const updatedComponents = cachedComponents.filter(comp => comp.id !== id);
      
      await cache.set("components", updatedComponents);
      dispatch(setStocks(updatedComponents));

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete component");
    }
  }
);


// Slice
const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<Component[]>) => {
      state.stocks = action.payload;
      cache.set("stocks", state.stocks);
    },
    addStock: (state, action: PayloadAction<Component>) => {
      state.stocks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.loading = false;
        
        // Ensure action.payload.data is an array.
        const newComponents: Component[] = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        
        // Merge arrays: if offset is 0, use newComponents; otherwise, combine with existing stocks.
        const combined = action.payload.offset === 0 
          ? newComponents 
          : [...state.stocks, ...newComponents];
        
        // Deduplicate using a Map keyed by the component's unique id.
        const deduplicated = Array.from(
          new Map(combined.map((comp) => [comp.id, comp])).values()
        );
        
        state.stocks = deduplicated;
      })
      .addCase(fetchComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createComponent.fulfilled, (state, action) => {
        state.stocks.push(action.payload);
      })
      .addCase(deleteComponent.fulfilled, (state, action) => {
        state.stocks = state.stocks.filter((c) => c.id !== action.payload);
      });
  },
});

// Export actions and selectors
export const { setStocks, addStock } = stockSlice.actions;
export const selectStocks = (state: any) => state.stocks.stocks;
export const selectStockLoading = (state: any) => state.stocks.loading;
export const selectStockError = (state: any) => state.stocks.error;

// Export reducer
export default stockSlice.reducer;

// Function to load stocks from LocalForage and dispatch them
export const initializeStocks = () => async (dispatch: any) => {
  const storedStocks = await cache.get("stocks");
  dispatch(setStocks(storedStocks));
};

// Explicitly export StockState type
export type { StockState };