import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Component } from '../../clinic/types/componentType';

interface StockState {
  stocks: Component[]; // Array of stocks
}

const initialState: StockState = {
  stocks: [],
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<Component>) => {
      state.stocks.push(action.payload); // Add a new stock
    },
    updateStock: (state, action: PayloadAction<Component>) => {
      const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
      if (index !== -1) {
        state.stocks[index] = action.payload; // Update an existing stock
      }
    },
    setStocks: (state, action: PayloadAction<Component[]>) => {
      state.stocks = action.payload; // Replace all stocks with new data
    },
  },
});

// Export actions
export const { addStock, updateStock, setStocks } = stockSlice.actions;

// Selector to get stocks from state
export const selectStocks = (state: any) => state.stocks.stocks;

// Export reducer
export default stockSlice.reducer;