// src/api/slices/patientSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import UnifiedDataService from "@/api/services/unifiedDataService";

// Define Patient State
export interface PatientUserState {
  patientsList: any[]; // Table Data (Paginated)
  detailedPatients: any[]; // Detailed Drawer Data (Limited to 20)
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

// Async thunk to fetch paginated patients using the unified data service

export const fetchPatients = createAsyncThunk(
  "patients/fetch",
  async (
    { token, clinicDb, name = "", offset = 0 }: { token: string; clinicDb: string; name?: string; offset?: number },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      // Call getResources for the "patients" resource.
      const result = await dataService.getResources("patients", { name, offset: String(offset) });
      console.log("UnifiedDataService.getResources result:", result);
      // We assume result already has the shape { data, limit, offset }.
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch patients"
      );
    }
  }
);

// Async thunk to fetch detailed patient info using the unified data service
export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async (
    { id, token, clinicDb }: { id: string; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const patient = await dataService.getResourceById("patients", id);
      return patient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch patient details");
    }
  }
);

// Async thunk to create a new patient via the unified data service
export const createPatient = createAsyncThunk(
  "patients/create",
  async (
    { patient, token, clinicDb }: { patient: any; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const newPatient = await dataService.createResource("patients", patient);
      return newPatient;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create patient"
      );
    }
  }
);

// Async thunk to update a patient via the unified data service
export const updatePatient = createAsyncThunk(
  "patients/update",
  async (
    { id, patient, token, clinicDb }: { id: string; patient: any; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const updatedPatient = await dataService.updateResource("patients", id, patient);
      return updatedPatient;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update patient"
      );
    }
  }
);

// Async thunk to delete a patient via the unified data service
export const deletePatient = createAsyncThunk(
  "patients/delete",
  async (
    { id, token, clinicDb }: { id: string; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      await dataService.deleteResource("patients", id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete patient"
      );
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    // Store paginated patient list
    setPatientsList: (state, action: PayloadAction<any[]>) => {
      state.patientsList = action.payload;
    },

    // Update a patient in the table
    updatePatientInList: (state, action: PayloadAction<any>) => {
      const index = state.patientsList.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patientsList[index] = action.payload;
      } else {
        state.patientsList.push(action.payload);
      }
    },

    // Store detailed patient info (limited to 20 entries)
    setDetailedPatient: (state, action: PayloadAction<any>) => {
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
      // Fetch Table Data
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure action.payload.data is an array.
        const newPatients: any[] = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
          
        // If offset is 0, replace; otherwise, merge the new data with the existing array.
        const combined = action.payload.offset === 0
          ? newPatients
          : [...state.patientsList, ...newPatients];
      
        // Deduplicate based on a unique identifier (assuming each patient has a unique 'id').
        const deduplicated = Array.from(
          new Map(combined.map((patient) => [patient.id, patient])).values()
        );
      
        state.patientsList = deduplicated;
        state.offset = action.payload.offset;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Detailed Patient Data
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        const existingIndex = state.detailedPatients.findIndex((p) => p.id === action.payload.id);
        if (existingIndex !== -1) {
          state.detailedPatients[existingIndex] = action.payload;
        } else {
          state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
        }
      })

      // Create Patient
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patientsList.unshift(action.payload);
        state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
      })

      // Update Patient
      .addCase(updatePatient.fulfilled, (state, action) => {
        const detailedIndex = state.detailedPatients.findIndex((p) => p.id === action.payload.id);
        if (detailedIndex !== -1) {
          state.detailedPatients[detailedIndex] = action.payload;
        }
        const tableIndex = state.patientsList.findIndex((p) => p.id === action.payload.id);
        if (tableIndex !== -1) {
          state.patientsList[tableIndex] = action.payload;
        }
      })

      // Delete Patient
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patientsList = state.patientsList.filter((p) => p.id !== action.payload);
        state.detailedPatients = state.detailedPatients.filter((p) => p.id !== action.payload);
      });
  },
});

// Export actions and selectors
export const { setPatientsList, updatePatientInList, setDetailedPatient } = patientSlice.actions;
export const selectPatients = (state: any) => state.patients.patientsList;
export const selectDetailedPatients = (state: any) => state.patients.detailedPatients;
export const selectPatientLoading = (state: any) => state.patients.loading;
export const selectPatientError = (state: any) => state.patients.error;
export const selectPatientOffset = (state: any) => state.patients.offset;

export default patientSlice.reducer;