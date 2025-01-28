import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PatientService from '@/api/patientService';

interface PatientUserState {
  patientUser: any | null;
  patients: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientUserState = {
  patientUser: null,
  patients: [],
  loading: false,
  error: null,
};

// Thunks for handling patient users
export const fetchPatients = createAsyncThunk(
  'patientUser/fetchPatients',
  async ({ name = '', offset = 0 }: { name?: string; offset?: number }, { extra, rejectWithValue }: any) => {
    const { token, db } = extra;
    const service = new PatientService(token, db);
    try {
      const response = await service.getPatients(name, offset);
      return response; // Ensure response contains the patients array
    } catch (error) {
      console.error('Thunk error:', error); // Debug log
      return rejectWithValue(error);
    }
  }
);

export const fetchPatientUser = createAsyncThunk(
  'patientUser/fetchPatientUser',
  async (id: string, { extra, rejectWithValue }: any) => {
    const { token, db } = extra;
    const service = new PatientService(token, db);
    try {
      return await service.getPatient(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createPatientUser = createAsyncThunk(
  'patientUser/createPatientUser',
  async (data: any, { extra, dispatch, rejectWithValue }: any) => {
    const { token, db } = extra;
    const service = new PatientService(token, db);
    try {
      await service.createPatient(data);
      // Fetch updated list of patients
      dispatch(fetchPatients({}));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePatientUser = createAsyncThunk(
  'patientUser/updatePatientUser',
  async ({ id, data }: { id: string; data: any }, { extra, dispatch, rejectWithValue }: any) => {
    const { token, db } = extra;
    const service = new PatientService(token, db);
    try {
      const updatedPatient = await service.updatePatient(id, data);

      // Dispatch action to update the specific patient in the state
      dispatch(updatePatientInList(updatedPatient));

      return updatedPatient; // Return the updated patient data
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


const patientUserSlice = createSlice({
  name: 'patientUser',
  initialState,
  reducers: {
    resetPatientUserState: () => initialState,
    updatePatientInList: (state, action) => {
      const updatedPatient = action.payload;
      state.patients = state.patients.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data; // Store only the array of patients
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single patient user
      .addCase(fetchPatientUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientUser.fulfilled, (state, action) => {
        state.loading = false;
        state.patientUser = action.payload;
      })
      .addCase(fetchPatientUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create patient user
      .addCase(createPatientUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatientUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPatientUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update patient user
      .addCase(updatePatientUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePatientUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPatientUserState, updatePatientInList } = patientUserSlice.actions;

// Explicitly export the DrawerState type
export type { PatientUserState };

export default patientUserSlice.reducer;
