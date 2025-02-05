import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Component } from '@/features/clinic/types/componentType';
import { createComponentFactory } from "@/factories/componentFactory";
import { cache } from '@/shared/utils/localForage';
import { queueOfflineUpdate } from '@/api/syncQueue';
import { ComponentUpdater } from '@/shared/utils/ComponentUpdater';

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

// Factory-based Thunks

/** ✅ Fetch components from API or cache */
export const fetchComponents = createAsyncThunk(
  "stocks/fetch",
  async (
    { token, clinicDb, name = "", offset = 0 }: { token: string; clinicDb: string; name?: string; offset?: number },
    { rejectWithValue }
  ) => {
    const factory = createComponentFactory(token, clinicDb);
    try {
      const { components, offset: newOffset } = await factory.fetchComponents(name, offset);
      await cache.set("stocks", components);
      return { components, offset: newOffset };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch components");
    }
  }
);

/** ✅ Optimistic Creation of Component */
export const createComponent = createAsyncThunk(
  "stocks/create",
  async (
    { component, token, clinicDb }: { component: Partial<Component>; token: string; clinicDb: string },
    { rejectWithValue, dispatch }
  ) => {
    const factory = createComponentFactory(token, clinicDb);
    try {
      const newComponent = await factory.createComponent(component);
      const cachedComponents = await cache.get("stocks");
      const updatedComponents = [...cachedComponents, newComponent];
      await cache.set("stocks", updatedComponents);
      dispatch(setStocks(updatedComponents)); // Update Redux state
      return newComponent;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create component");
    }
  }
);

/** ✅ Optimistic Update of Component */
export const updateComponent = createAsyncThunk(
  "stocks/update",
  async (
    { id, component, token, clinicDb }: { id: string; component: Partial<Component>; token: string; clinicDb: string },
    { rejectWithValue, dispatch, getState }
  ) => {
    // Get current state
    const state: any = getState();
    const existingComponents: Component[] = state.stocks.stocks || [];

    // Optimistic update
    const optimisticComponents = ComponentUpdater.mergeComponent(existingComponents, id, component);
    await cache.set("stocks", optimisticComponents);
    dispatch(setStocks(optimisticComponents));

    // If online, attempt to update in the background
    if (navigator.onLine) {
      try {
        const factory = createComponentFactory(token, clinicDb);
        const confirmedComponent = await factory.updateComponent(id, component);
        const finalComponents = ComponentUpdater.mergeComponent(optimisticComponents, id, confirmedComponent);
        await cache.set("stocks", finalComponents);
        dispatch(setStocks(finalComponents));
        return confirmedComponent;
      } catch (error) {
        console.error("API update failed:", error);
        return rejectWithValue(error instanceof Error ? error.message : "Failed to update component");
      }
    } else {
      // If offline, queue update for later sync
      await queueOfflineUpdate({ type: "component", action: "update", data: { id, ...component } });
      return optimisticComponents.find((c) => c.id === id);
    }
  }
);

/** ✅ Optimistic Deletion of Component */
export const deleteComponent = createAsyncThunk(
  "stocks/delete",
  async (
    { id, token, clinicDb }: { id: string; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    const factory = createComponentFactory(token, clinicDb);
    try {
      await factory.deleteComponent(id);
      const cachedComponents = await cache.get("stocks");
      const updatedList = cachedComponents.filter((c: Component) => c.id !== id);
      await cache.set("stocks", updatedList);
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
        state.stocks = action.payload.components;
        state.offset = action.payload.offset;
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