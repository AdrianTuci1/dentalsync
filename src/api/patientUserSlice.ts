import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createPatientFactory } from "@/factories/patientFactory";
import { cache } from "@/shared/utils/localForage";


// ✅ Define Patient State
interface PatientState {
  patientsList: any[]; // ✅ Table Data (Paginated)
  detailedPatients: any | null; // ✅ Detailed Drawer Data (Limited to 20)
  loading: boolean;
  error: string | null;
  offset: number;
}

const initialState: PatientState = {
  patientsList: [],
  detailedPatients: [],
  loading: false,
  error: null,
  offset: 0,
};

// ✅ Fetch patients (Paginated Table Data)
export const fetchPatients = createAsyncThunk(
  "patients/fetch",
  async ({ token, clinicDb, name = "", offset = 0 }: { token: string; clinicDb: string; name?: string; offset?: number }, { rejectWithValue }) => {
    const factory = createPatientFactory(token, clinicDb);
    try {
      const response = await factory.fetchPatients(name, offset);
      await cache.set("patients", response); // ✅ Cache patients list
      return { patients: response, offset };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch patients");
    }
  }
);

// ✅ Fetch detailed patient info (Drawer Data - Limited Cache)
export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async ({ id, token, clinicDb }: { id: string; token: string; clinicDb: string }, { getState, rejectWithValue }) => {
    const factory = createPatientFactory(token, clinicDb);
    const state: any = getState();
    
    // ✅ Check cache first (Limit to 20 entries)
    const cachedPatient = state.patients.detailedPatients.find((p: any) => p.id === id);
    if (cachedPatient) return cachedPatient;

    try {
      const patient = await factory.fetchPatientById(id);

      // ✅ Maintain max 20 cached detailed entries
      const updatedCache = [patient, ...state.patients.detailedPatients].slice(0, 20);
      await cache.set("detailedPatients", updatedCache);

      return patient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch patient details");
    }
  }
);

// ✅ Create a new patient
export const createPatient = createAsyncThunk(
  "patients/create",
  async ({ patient, token, clinicDb }: { patient: any; token: string; clinicDb: string }, { rejectWithValue }) => {
    const factory = createPatientFactory(token, clinicDb);
    try {
      const newPatient = await factory.createPatient(patient);
      return newPatient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create patient");
    }
  }
);

// ✅ Update patient info
export const updatePatient = createAsyncThunk(
  "patients/update",
  async ({ id, patient, token, clinicDb }: { id: string; patient: any; token: string; clinicDb: string }, { rejectWithValue }) => {
    const factory = createPatientFactory(token, clinicDb);
    try {
      const updatedPatient = await factory.updatePatient(id, patient);
      return updatedPatient;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update patient");
    }
  }
);

// ✅ Delete patient
export const deletePatient = createAsyncThunk(
  "patients/delete",
  async ({ id, token, clinicDb }: { id: string; token: string; clinicDb: string }, { rejectWithValue }) => {
    const factory = createPatientFactory(token, clinicDb);
    try {
      await factory.deletePatient(id);
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
    // ✅ Store paginated patient list
    setPatientsList: (state, action: PayloadAction<any[]>) => {
      state.patientsList = action.payload;
    },

    // ✅ Update a patient in the table
    updatePatientInList: (state, action: PayloadAction<any>) => {
      const index = state.patientsList.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patientsList[index] = action.payload;
      } else {
        state.patientsList.push(action.payload);
      }
    },

    // ✅ Store detailed patient info (Limited to 20 entries)
    setDetailedPatient: (state, action: PayloadAction<any>) => {
      const existingIndex = state.detailedPatients.findIndex((p:any) => p.id === action.payload.id);
      if (existingIndex !== -1) {
        state.detailedPatients[existingIndex] = action.payload;
      } else {
        // ✅ Maintain max 20 cache entries
        state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Table Data
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.patientsList = action.payload.patients;
        state.offset = action.payload.offset;
      })

      // ✅ Fetch Detailed Data (Drawer)
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        const existingIndex = state.detailedPatients.findIndex((p: any) => p.id === action.payload.id);
        if (existingIndex !== -1) {
          state.detailedPatients[existingIndex] = action.payload;
        } else {
          state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
        }
      })

      // ✅ Create Patient (Add to Table)
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patientsList.unshift(action.payload);
        state.detailedPatients = [action.payload, ...state.detailedPatients].slice(0, 20);
      })

      // ✅ Update Patient (Modify Table & Detailed Cache)
      .addCase(updatePatient.fulfilled, (state, action) => {
        // Update detailed list
        const detailedIndex = state.detailedPatients.findIndex((p: any) => p.id === action.payload.id);
        if (detailedIndex !== -1) {
          state.detailedPatients[detailedIndex] = action.payload;
        }

        // Update table list
        const tableIndex = state.patientsList.findIndex((p) => p.id === action.payload.id);
        if (tableIndex !== -1) {
          state.patientsList[tableIndex] = action.payload;
        }
      })

      // ✅ Delete Patient
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patientsList = state.patientsList.filter((p) => p.id !== action.payload);
        state.detailedPatients = state.detailedPatients.filter((p: any) => p.id !== action.payload);
      });
  },
});

// ✅ Export actions
export const { setPatientsList, updatePatientInList, setDetailedPatient } = patientSlice.actions;

// ✅ Export selectors
export const selectPatients = (state: any) => state.patients.patientsList;
export const selectDetailedPatients = (state: any) => state.patients.detailedPatients;
export const selectPatientLoading = (state: any) => state.patients.loading;
export const selectPatientError = (state: any) => state.patients.error;
export const selectPatientOffset = (state: any) => state.patients.offset;

// ✅ Export reducer
export default patientSlice.reducer;

// ✅ Export PatientState type
export type { PatientState };