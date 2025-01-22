import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/api/authSlice';
import requestReducer from '@/api/requestSlice';
import drawerReducer from '@/components/drawerSlice';
import appointmentsReducer from '@/api/appointmentsSlice';
import stockReducer from '@/api/stockSlice';
import treatmentReducer from '@/api/treatmentSlice';
import patientUserReducer from '@/api/patientUserSlice'
import permissionsReducer from "@/api/permissionsSlice";
import { getSubdomain } from '../utils/getSubdomains';

const extraArgument = {
  get token() {
    return store.getState().auth.subaccountToken; // Dynamically fetch token
  },
  get db() {
    return getSubdomain() + '_db'; // Dynamically compute db
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    request: requestReducer,
    drawer: drawerReducer,
    appointments: appointmentsReducer,
    stocks: stockReducer,
    treatments: treatmentReducer,
    patientUser: patientUserReducer,
    permissions: permissionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument, // Pass dynamically computed extraArgument
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;