import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Adjust path as necessary
import requestReducer from './requestSlice';
import drawerReducer from './drawerSlice';
import appointmentsReducer from  './appointmentsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    request: requestReducer,
    drawer: drawerReducer,
    appointments: appointmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
