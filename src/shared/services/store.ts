import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/api/authSlice';
import requestReducer from '@/api/requestSlice';
import drawerReducer from '@/components/drawerSlice';
import appointmentsReducer from '@/api/appointmentsSlice';
import stockReducer, { initializeStocks } from '@/api/stockSlice';
import treatmentReducer from '@/api/treatmentSlice';
import patientUserReducer from '@/api/patientUserSlice'
import permissionsReducer from "@/api/permissionsSlice";
import { getSubdomain } from '../utils/getSubdomains';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist/es/constants";
import syncReducer from "@/api/syncSlice";


// Persist Config (to save data across reloads)
const persistConfig = {
  key: "root",
  storage, // Uses local storage (you can change it to LocalForage if needed)
  whitelist: ["treatments"], // Persist only treatments
};

const persistedTreatmentReducer = persistReducer(persistConfig, treatmentReducer);

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
    treatments: persistedTreatmentReducer,
    patientUser: patientUserReducer,
    permissions: permissionsReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument, // Use typed extraArgument
      },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore serialization issues
      },
    }),
});


// Persistor for persisting the store
export const persistor = persistStore(store);

// Initialize stocks from LocalForage when the app starts
store.dispatch(initializeStocks());



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;