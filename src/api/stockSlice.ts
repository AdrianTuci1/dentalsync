import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Component } from '@/features/clinic/types/componentType';
import localforage from 'localforage';
import ComponentService from '@/api/componentService';

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

// Load stocks from LocalForage asynchronously
const loadStocksFromStorage = async (): Promise<Component[]> => {
  const storedStocks = await localforage.getItem<Component[]>('stocks');
  return storedStocks || [];
};


// Async Thunk to fetch stocks from API
export const fetchComponents = createAsyncThunk(
  'stocks/fetchComponents',
  async ({ name = '', offset = 0, token, clinicDb }: { name?: string; offset?: number; token: string; clinicDb: string }, { rejectWithValue }) => {
    try {
      const componentService = new ComponentService(token, clinicDb); // ✅ Create an instance
      const { components, offset: newOffset } = await componentService.getAllComponents(name, offset);

      // Store the new data in LocalForage
      await localforage.setItem('stocks', components);
      await localforage.setItem('stocks_timestamp', Date.now());

      return { components, offset: newOffset };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch components');
    }
  }
);


const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<Component>) => {
      state.stocks.push(action.payload);
      localforage.setItem('stocks', state.stocks);
    },
    updateStock: (state, action: PayloadAction<Component>) => {
      const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
      if (index !== -1) {
        state.stocks[index] = action.payload;
        localforage.setItem('stocks', state.stocks);
      }
    },
    setStocks: (state, action: PayloadAction<Component[]>) => {
      state.stocks = action.payload;
      localforage.setItem('stocks', state.stocks);
    },
    loadStocks: (state, action: PayloadAction<Component[]>) => {
      state.stocks = action.payload;
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
      });
  },
});

// Export actions
export const { addStock, updateStock, setStocks, loadStocks } = stockSlice.actions;

// Selectors
export const selectStocks = (state: any) => state.stocks.stocks;
export const selectStockLoading = (state: any) => state.stocks.loading;
export const selectStockError = (state: any) => state.stocks.error;

// Explicitly export StockState type
export type { StockState };

// Export reducer
export default stockSlice.reducer;

// Function to load stocks from LocalForage and dispatch them
export const initializeStocks = () => async (dispatch: any) => {
  const storedStocks = await loadStocksFromStorage();
  dispatch(loadStocks(storedStocks));
};