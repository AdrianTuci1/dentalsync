import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import requestReducer from './requestSlice';
import drawerReducer from './drawerSlice';
import appointmentsReducer from './appointmentsSlice';
import stockReducer from './stockSlice';
import treatmentReducer from './treatmentSlice';
import patientUserReducer from './patientUserSlice'
import permissionsReducer from "./permissionsSlice";
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