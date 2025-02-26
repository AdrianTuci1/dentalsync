import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Component } from '@/features/clinic/types/componentType';
import UnifiedDataService from '../services/unifiedDataService';
import { RootState } from '@/shared/services/store';

interface StockState {
  components: Component[];
  loading: boolean;
  error: string | null;
  offset: number;
}

const initialState: StockState = {
  components: [],
  loading: false,
  error: null,
  offset: 0,
};


// ✅ Explicitly Define Extra Argument Type
interface ExtraArg {
  db: string;
}

// ✅ Fetch Components with Proper Caching & Pagination
export const fetchComponents = createAsyncThunk<
  Component[], // Expected return type
  void, // No arguments required in payload
  { extra: ExtraArg } // Explicitly define the extra argument
>(
  "stocks/fetch",
  async (_, { rejectWithValue, extra }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`📡 Fetching components for clinic: ${extra.db}`);

      const result = await service.getResources("components", {});
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch components");
    }
  }
);

// ✅ Optimistic Component Creation (Cache Only After API)
export const createComponent = createAsyncThunk<
  Component,
  { component: Partial<Component> },
  { extra: ExtraArg }
>(
  "stocks/create",
  async ({ component }, { rejectWithValue, extra, dispatch, getState }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`🆕 Creating component in clinic: ${extra.db}`);

      // ✅ Optimistic UI Update Before API Call
      const state = getState() as RootState;
      const tempId = `temp-${Date.now()}`;
      const newComponent: Component = { ...component, id: tempId } as Component;
      dispatch(setStocks([newComponent, ...state.stocks.components]));

      // ✅ API Call
      const savedComponent = await service.createResource("components", component);

      return savedComponent;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create component");
    }
  }
);

// ✅ Optimistic Component Update (Use Full API Response)
export const updateComponent = createAsyncThunk<
  Component,
  { id: string; changes: Partial<Component> },
  { extra: ExtraArg }
>(
  "stocks/update",
  async ({ id, changes }, { rejectWithValue, extra, dispatch, getState }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`✏️ Updating component ID: ${id} in clinic: ${extra.db}`);

      // ✅ Optimistic UI Update Before API Call
      const state = getState() as RootState;
      const optimisticUpdate = state.stocks.components.map(comp =>
        comp.id === id ? { ...comp, ...changes } : comp
      );
      dispatch(setStocks(optimisticUpdate));

      // ✅ API Call
      const updatedComponent = await service.updateResource("components", id, changes);

      return updatedComponent;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update component");
    }
  }
);

// ✅ Optimistic Component Deletion
export const deleteComponent = createAsyncThunk<
  string,
  { id: string },
  { extra: ExtraArg }
>(
  "stocks/delete",
  async ({ id }, { rejectWithValue, extra, dispatch, getState }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`🗑️ Deleting component ID: ${id} in clinic: ${extra.db}`);

      // ✅ Optimistic UI Update Before API Call
      const state = getState() as RootState;
      dispatch(setStocks(state.stocks.components.filter(comp => comp.id !== id)));

      // ✅ API Call
      await service.deleteResource("components", id);

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete component");
    }
  }
);

// Slice
// ✅ Slice (Ensure Components Update Properly)
const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<Component[]>) => {
      console.log("📦 Setting Stocks in Redux:", action.payload); // Debugging log
      state.components = [...action.payload]; // 🔥 New reference to trigger UI update
    },
    setNextOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponents.fulfilled, (state, action) => {
        if (state.offset === 0) {
          state.components = action.payload; // Overwrite if first load
        } else {
          state.components = [...state.components, ...action.payload]; // Append if loading more
        }
      })
      .addCase(createComponent.fulfilled, (state, action) => {
        state.components = [action.payload, ...state.components]; // **Ensures UI reflects change**
      })
      .addCase(updateComponent.fulfilled, (state, action) => {
        state.components = state.components.map(comp =>
          comp.id === action.payload.id ? action.payload : comp
        ); // **Ensures UI reflects change**
      })
      .addCase(deleteComponent.fulfilled, (state, action) => {
        state.components = state.components.filter(comp => comp.id !== action.payload); // **Ensures UI reflects change**
      });
  },
});


export const { setStocks, setNextOffset } = stockSlice.actions;

// Export actions and selectors

export const selectStocks = (state: any) => state.stocks.stocks;
export const selectStockLoading = (state: any) => state.stocks.loading;
export const selectStockError = (state: any) => state.stocks.error;

// Export reducer
export default stockSlice.reducer;

// Explicitly export StockState type
export type { StockState };