import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/api/slices/authSlice';
import requestReducer from '@/api/slices/requestSlice';
import drawerReducer from '@/components/drawerSlice';
import appointmentsReducer from '@/api/slices/appointmentsSlice';
import stockReducer from '@/api/slices/stockSlice';
import treatmentReducer from '@/api/slices/treatmentSlice';
import patientUserReducer from '@/api/slices/patientUserSlice'
import permissionsReducer from "@/api/slices/permissionsSlice";
import medicReducer from "@/api/slices/medicSlice"
import { getSubdomain } from '../utils/getSubdomains';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist/es/constants";
import syncReducer from "@/api/syncSlice";


// Persist Config (to save data across reloads)
const persistConfig = {
  key: "root",
  storage, // Uses local storage (you can change it to LocalForage if needed)
  whitelist: ["treatments", "stocks", "medics", "patients"], 
};

const persistedTreatmentReducer = persistReducer(persistConfig, treatmentReducer);
const persistedComponentReducer = persistReducer(persistConfig, stockReducer);
const persistedMedicReducer = persistReducer(persistConfig, medicReducer);
const persistedPatientReducer = persistReducer(persistConfig, patientUserReducer)

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
    stocks: persistedComponentReducer,
    treatments: persistedTreatmentReducer,
    patients: persistedPatientReducer,
    medics: persistedMedicReducer,
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



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;