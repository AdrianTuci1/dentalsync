import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '@/features/clinic/types/appointmentEvent';
import AppointmentService from '@/api/services/fetchAppointments';
import { RootState } from '@/shared/services/store';

interface AppointmentsState {
  appointmentDetails: Appointment;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  appointmentDetails: {
    appointmentId: '',
    date: '',
    time: '',
    isDone: false,
    price: 0,
    isPaid: false,
    status: 'upcoming',
    medicId: undefined,
    medicUser: '',
    patientId: undefined,
    patientUser: '',
    treatmentId: undefined,
    initialTreatment: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    treatments: [],
  },
  loading: false,
  error: null,
};

// Async thunk for fetching appointment by ID
export const fetchAppointmentById = createAsyncThunk<
  Appointment,
  string,
  { state: RootState; rejectValue: string }
>(
  'appointments/fetchAppointmentById',
  async (appointmentId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.subaccountToken;
    const database = 'demo_db';


    const appointmentService = new AppointmentService(token || '', database);

    try {
      const response = await appointmentService.fetchAppointment(appointmentId);
      return response;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating appointment
export const updateAppointment = createAsyncThunk<
  Appointment,
  Partial<Appointment>,
  { state: RootState; rejectValue: string }
>(
  'appointments/updateAppointment',
  async (updatedFields, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.subaccountToken;
    const database = 'demo_db';

    const appointmentService = new AppointmentService(token || '', database);
    const { appointmentId } = state.appointments.appointmentDetails;

    if (!appointmentId) {
      return rejectWithValue('No appointmentId provided');
    }

    try {
      // Use PATCH to send only updated fields
      const response = await appointmentService.editAppointment(
        appointmentId,
        updatedFields
      );
      return response;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for creating appointment
export const createAppointment = createAsyncThunk<
  Appointment,
  Appointment,
  { state: any; rejectValue: string }
>(
  'appointments/createAppointment',
  async (appointmentData, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.subaccountToken;
    const database = 'demo_db';
    const appointmentService = new AppointmentService(token , database);

    try {
      const response = await appointmentService.createAppointment(appointmentData);
      return response;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointmentDetails(state, action: PayloadAction<Appointment>) {
      state.appointmentDetails = action.payload;
    },
    updateAppointmentField<K extends keyof Appointment>(
      state: AppointmentsState,
      action: PayloadAction<{ field: K; value: Appointment[K] }>
    ) {
      state.appointmentDetails[action.payload.field] = action.payload.value;
    },
    resetAppointment(state) {
      state.appointmentDetails = initialState.appointmentDetails;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentDetails = {
          ...state.appointmentDetails,
          ...action.payload,
        };
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update appointment';
      })
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentDetails = action.payload;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create appointment';
      });
  },
});

export const {
  setAppointmentDetails,
  updateAppointmentField,
  resetAppointment,
} = appointmentsSlice.actions;


// Explicitly export the DrawerState type
export type { AppointmentsState };

export default appointmentsSlice.reducer;
