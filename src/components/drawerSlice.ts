import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DrawerState {
  drawers: Array<{ type: string; data: any }>; // Stack of open drawers
}

const initialState: DrawerState = {
  drawers: [], // Each entry represents a drawer
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<{ type: string; data: any }>) => {
      state.drawers.push(action.payload); // Add a new drawer with type and data
    },
    closeDrawer: (state) => {
      state.drawers.pop(); // Remove the topmost drawer
    },
    closeAllDrawers: (state) => {
      state.drawers = []; // Clear all drawers
    },
  },
});

export const { openDrawer, closeDrawer, closeAllDrawers } = drawerSlice.actions;
export default drawerSlice.reducer;
