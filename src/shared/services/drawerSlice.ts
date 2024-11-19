// store/drawerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  drawerType: null, // To differentiate drawers
  drawerData: {},   // Dynamic data for the drawer
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      state.isOpen = true;
      state.drawerType = action.payload.type; // e.g., 'Appointment', 'Patient'
      state.drawerData = action.payload.data || {}; // Any dynamic data
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.drawerType = null;
      state.drawerData = {};
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;
