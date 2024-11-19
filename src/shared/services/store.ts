import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Adjust path as necessary
import appointmentReducer from './appointmentSlice';
import drawerReducer from './drawerSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
    drawer: drawerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
