import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import UnifiedDataService from "@/api/services/unifiedDataService";
import { getSubdomain } from "@/shared/utils/getSubdomains";
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
  async ({ token, name = "", offset = 0 }: { token: string; name?: string; offset?: number }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`📡 Fetching patients for clinic: ${clinicDb} (Offset: ${offset})`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const result = await service.getResources("patients", { name, offset: String(offset) });

      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch patients");
    }
  }
);

// ✅ Fetch a Single Patient by ID
export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🔎 Fetching patient ID: ${id} from clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const patient = await service.getResourceById("patients", id);
      return patient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch patient details");
    }
  }
);

// ✅ Create a Patient
export const createPatient = createAsyncThunk(
  "patients/create",
  async ({ patient, token }: { patient: Partial<Patient>; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🆕 Creating patient in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const newPatient = await service.createResource("patients", patient);
      return newPatient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create patient");
    }
  }
);

// ✅ Update a Patient
export const updatePatient = createAsyncThunk(
  "patients/update",
  async ({ id, patient, token }: { id: string; patient: Partial<Patient>; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`✏️ Updating patient ID: ${id} in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const updatedPatient = await service.updateResource("patients", id, patient);
      return updatedPatient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update patient");
    }
  }
);

// ✅ Delete a Patient
export const deletePatient = createAsyncThunk(
  "patients/delete",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🗑️ Deleting patient ID: ${id} in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
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
    // Store paginated patient list
    setPatientsList: (state, action: PayloadAction<Patient[]>) => {
      state.patientsList = action.payload;
    },

    // Update a patient in the table
    updatePatientInList: (state, action: PayloadAction<Patient>) => {
      const index = state.patientsList.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patientsList[index] = action.payload;
      } else {
        state.patientsList.push(action.payload);
      }
    },

    // Store detailed patient info (limited to 20 entries)
    setDetailedPatient: (state, action: PayloadAction<Patient>) => {
      const existingIndex = state.detailedPatients.findIndex((p) => p.id === action.payload.id);
      if (existingIndex !== -1) {
        state.detailedPatients[existingIndex] = action.payload;
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
        const newPatients = Array.isArray(action.payload.data) ? action.payload.data : [];

        state.patientsList =
          action.payload.offset === 0
            ? newPatients
            : [...state.patientsList, ...newPatients].reduce(
                (acc, item) => acc.find((i: any) => i.id === item.id) ? acc : [...acc, item], [] as Patient[]
              );
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
        state.patientsList.unshift(action.payload);
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
export const { setPatientsList, updatePatientInList, setDetailedPatient } = patientSlice.actions;
export const selectPatients = (state: RootState) => state.patients.patientsList;
export const selectDetailedPatients = (state: RootState) => state.patients.detailedPatients;
export const selectPatientLoading = (state: RootState) => state.patients.loading;
export const selectPatientError = (state: RootState) => state.patients.error;
export default patientSlice.reducer;