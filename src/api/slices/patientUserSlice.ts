import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import UnifiedDataService from "@/api/services/unifiedDataService";
import { RootState } from "@/shared/services/store";

// Define Patient Type
export interface Patient {
  id: string;
  name: string;
  [key: string]: any;
}

// Define Patient State
export interface PatientUserState {
  patientsList: Patient[]; // Table Data (Paginated)
  detailedPatients: Patient[]; // Detailed Drawer Data (Limited to 20)
  loading: boolean;
  error: string | null;
  offset: number;
}

const initialState: PatientUserState = {
  patientsList: [],
  detailedPatients: [],
  loading: false,
  error: null,
  offset: 0,
};

// ✅ Fetch Patients (Paginated)
export const fetchPatients = createAsyncThunk(
  "patients/fetch",
  async ({ name = "", offset = 0 }: { name?: string; offset?: number }, { rejectWithValue, extra }) => {
    const { token, db } = extra as { token: string; db: string };

    console.log(`📡 Fetching patients for clinic: ${db} (Offset: ${offset})`);

    try {
      const service = UnifiedDataService.getInstance(token, db);
      const result = await service.getResources("patients", { name, offset: String(offset) });

      return result; // Ensure API response structure is compatible with Redux state
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch patients");
    }
  }
);

// ✅ Fetch a Single Patient by ID
export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async (id: string, { rejectWithValue, extra }) => {
    const { token, db } = extra as { token: string; db: string };

    console.log(`🔎 Fetching patient ID: ${id} from clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);
      const patient = await service.getResourceById("patients", id);
      return patient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch patient details");
    }
  }
);

// ✅ Create a Patient (Optimistic Update)
export const createPatient = createAsyncThunk(
  "patients/create",
  async (patient: Partial<Patient>, { rejectWithValue, extra, dispatch }) => {
    const { token, db } = extra as { token: string; db: string };

    console.log(`🆕 Creating patient in clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);

      // Optimistic update
      dispatch(addOptimisticPatient(patient));

      const newPatient = await service.createResource("patients", patient);
      return newPatient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create patient");
    }
  }
);

// ✅ Update a Patient (Optimistic Update)
export const updatePatient = createAsyncThunk(
  "patients/update",
  async ({ id, patient }: { id: string; patient: Partial<Patient> }, { rejectWithValue, extra, dispatch }) => {
    const { token, db } = extra as { token: string; db: string };

    console.log(`✏️ Updating patient ID: ${id} in clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);

      // Optimistic update
      dispatch(updateOptimisticPatient({ id, patient }));

      const updatedPatient = await service.updateResource("patients", id, patient);
      return updatedPatient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update patient");
    }
  }
);

// ✅ Delete a Patient (Optimistic Update)
export const deletePatient = createAsyncThunk(
  "patients/delete",
  async (id: string, { rejectWithValue, extra, dispatch }) => {
    const { token, db } = extra as { token: string; db: string };

    console.log(`🗑️ Deleting patient ID: ${id} in clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);

      // Optimistic update
      dispatch(deleteOptimisticPatient(id));

      await service.deleteResource("patients", id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete patient");
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    // ✅ Optimistic Add Patient
    addOptimisticPatient: (state, action: PayloadAction<Partial<Patient>>) => {
      const tempPatient: Patient = {
        id: "temp_" + Date.now(),
        name: action.payload.name ?? "Unnamed Patient",
        ...action.payload, // Spread existing data
      };

      state.patientsList.unshift(tempPatient);
    },

    // ✅ Optimistic Update Patient
    updateOptimisticPatient: (state, action: PayloadAction<{ id: string; patient: Partial<Patient> }>) => {
      state.patientsList = state.patientsList.map((p) =>
        p.id === action.payload.id ? { ...p, ...action.payload.patient } : p
      );
      state.detailedPatients = state.detailedPatients.map((p) =>
        p.id === action.payload.id ? { ...p, ...action.payload.patient } : p
      );
    },

    // ✅ Optimistic Delete Patient
    deleteOptimisticPatient: (state, action: PayloadAction<string>) => {
      state.patientsList = state.patientsList.filter((p) => p.id !== action.payload);
      state.detailedPatients = state.detailedPatients.filter((p) => p.id !== action.payload);
    },
    setDetailedPatient: (state, action: PayloadAction<Patient>) => {
      const existingIndex = state.detailedPatients.findIndex((p) => p.id === action.payload.id);
      
      if (existingIndex !== -1) {
        state.detailedPatients[existingIndex] = { 
          ...state.detailedPatients[existingIndex], 
          ...action.payload 
        };
      } else {
        // Maintain max 20 cache entries
        state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        
        if (!action.payload) return; // Ensure data exists
  
        const newPatients = Array.isArray(action.payload.data) ? action.payload.data : [];
        const offset = action.meta.arg.offset ?? 0; // ✅ Provide default value for `offset`
  
        state.patientsList =
          offset === 0
            ? newPatients // ✅ Replace list when starting a new search
            : [...state.patientsList, ...newPatients].reduce(
                (acc, item) => (acc.find((p: any) => p.id === item.id) ? acc : [...acc, item]),
                [] as Patient[]
              ); // ✅ Prevent duplicate patients
  
        state.offset = offset + newPatients.length; // ✅ Update offset safely
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        const existingIndex = state.detailedPatients.findIndex((p) => p.id === action.payload.id);
        if (existingIndex !== -1) {
          state.detailedPatients[existingIndex] = action.payload;
        } else {
          state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
        }
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patientsList = state.patientsList.map((p) =>
          p.id.startsWith("temp_") ? action.payload : p
        );
        state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.patientsList = state.patientsList.map((p) => (p.id === action.payload.id ? action.payload : p));
        state.detailedPatients = state.detailedPatients.map((p) => (p.id === action.payload.id ? action.payload : p));
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patientsList = state.patientsList.filter((p) => p.id !== action.payload);
        state.detailedPatients = state.detailedPatients.filter((p) => p.id !== action.payload);
      });
  },
});

// Export actions and selectors
export const { addOptimisticPatient, updateOptimisticPatient, deleteOptimisticPatient, setDetailedPatient } = patientSlice.actions;
export const selectPatients = (state: RootState) => state.patients.patientsList;
export const selectDetailedPatients = (state: RootState) => state.patients.detailedPatients;
export const selectPatientLoading = (state: RootState) => state.patients.loading;
export const selectPatientError = (state: RootState) => state.patients.error;
export default patientSlice.reducer;