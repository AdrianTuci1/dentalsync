import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import UnifiedDataService from "@/api/services/unifiedDataService";
import { cache } from "@/api/cacheService";
import { RootState } from "@/shared/services/store";

// 🔹 Define Redux State
export interface AppointmentsState {
  weeklyAppointments: any[];
  detailedAppointments: any[];
  appointmentDetails: any | null;
}

const initialState: AppointmentsState = {
  weeklyAppointments: [],
  detailedAppointments: [],
  appointmentDetails: null,
};

interface ThunkExtra {
  token: string;
  db: string;
}

export const fetchAppointmentByIdThunk = createAsyncThunk<
  any, // Return type
  string, // Argument type (appointmentId)
  { state: RootState; extra: ThunkExtra } // Type for getState & extra
>(
  "appointments/fetchById",
  async (appointmentId, { getState, extra }) => {
    const state = getState();
    const dataService = UnifiedDataService.getInstance(extra.token, extra.db);

    const cachedData = state.appointments.detailedAppointments.find(
      (a) => a.appointmentId === appointmentId
    );
    if (cachedData) return cachedData;

    return await dataService.getResourceById("appointments", appointmentId);
  }
);

// ✅ Create appointment
export const createAppointmentThunk = createAsyncThunk<
  any, // Return type
  any, // Argument type (appointmentDetails)
  { state: RootState; extra: ThunkExtra } // Type for getState & extra
>(
  "appointments/create",
  async (appointmentDetails, { dispatch, extra }) => {
    const dataService = UnifiedDataService.getInstance(extra.token, extra.db);

    const createdAppointment = await dataService.createResource("appointments", appointmentDetails);

    // ✅ Optimistically update weekly appointments
    dispatch(webSocketUpdateThunk({ action: "create", data: createdAppointment }));

    return createdAppointment;
  }
);


// ✅ Update appointment
export const updateAppointmentThunk = createAsyncThunk<
  any, // Return type
  any, // Argument type (appointmentDetails)
  { state: RootState; extra: ThunkExtra } // Type for getState & extra
>(
  "appointments/update",
  async (appointmentDetails, { dispatch, extra }) => {
    const dataService = UnifiedDataService.getInstance(extra.token, extra.db);

    const updatedAppointment = await dataService.patchResource(
      "appointments",
      appointmentDetails.appointmentId,
      appointmentDetails
    );

    // ✅ Optimistically update weekly appointments
    dispatch(webSocketUpdateThunk({ action: "update", data: updatedAppointment }));

    return updatedAppointment;
  }
);

// ✅ Delete appointment
export const deleteAppointmentThunk = createAsyncThunk<
  string, // Return type (appointmentId)
  string, // Argument type (appointmentId)
  { state: RootState; extra: ThunkExtra } // Type for getState & extra
>(
  "appointments/delete",
  async (appointmentId, { dispatch, extra }) => {
    const dataService = UnifiedDataService.getInstance(extra.token, extra.db);

    await dataService.deleteResource("appointments", appointmentId);

    // ✅ Optimistically remove from weekly appointments
    dispatch(webSocketUpdateThunk({ action: "delete", data: { appointmentId } }));

    return appointmentId;
  }
);


// ✅ WebSocket handles real-time updates
export const webSocketUpdateThunk = createAsyncThunk(
  "appointments/webSocketUpdate",
  async ({ action, data }: { action: string; data: any }, { getState }) => {
    const state = getState() as { appointments: AppointmentsState };
    let updatedWeeklyAppointments = [...state.appointments.weeklyAppointments];

    switch (action) {
      case "view":
        updatedWeeklyAppointments = data;
        break;
      case "create":
        updatedWeeklyAppointments = [...updatedWeeklyAppointments, data];
        break;
      case "update":
        updatedWeeklyAppointments = updatedWeeklyAppointments.map((appt) =>
          appt.appointmentId === data.appointmentId ? data : appt
        );
        break;
      case "delete":
        updatedWeeklyAppointments = updatedWeeklyAppointments.filter(
          (appt) => appt.appointmentId !== data.appointmentId
        );
        break;
      default:
        console.warn(`⚠️ Unhandled WebSocket action: ${action}`);
    }

    // Always update cache with the latest weekly appointments
    await cache.set("weeklyAppointments", updatedWeeklyAppointments);

    return { updatedWeeklyAppointments };
  }
);

// ✅ Slice Definition
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setWeeklyAppointments(state, action: PayloadAction<any[]>) {
      state.weeklyAppointments = action.payload;
    },
    setAppointmentDetails(state, action: PayloadAction<any>) {
      if (!action.payload) return; // Ensure payload is valid
      
      state.appointmentDetails = action.payload;
      
      if (!state.detailedAppointments) {
        state.detailedAppointments = []; // Ensure array exists
      }
    
      const index = state.detailedAppointments.findIndex(a => a.appointmentId === action.payload.appointmentId);
      if (index !== -1) {
        state.detailedAppointments[index] = action.payload;
      } else {
        state.detailedAppointments.push(action.payload);
      }
    },
    updateAppointmentField(state, action: PayloadAction<{ field: string; value: any }>) {
      if (state.appointmentDetails) {
        state.appointmentDetails = {
          ...state.appointmentDetails,
          [action.payload.field]: action.payload.value,
        };
      }
    },
    updateAppointmentState(state, action: PayloadAction<any>) {
      const updatedAppointment = action.payload;
    
      state.detailedAppointments = state.detailedAppointments.map((appt) =>
        appt.appointmentId === updatedAppointment.appointmentId ? updatedAppointment : appt
      );
    },
    resetAppointment(state) {
      state.appointmentDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentByIdThunk.fulfilled, (state, action) => {
        state.appointmentDetails = action.payload;
      })
      .addCase(createAppointmentThunk.fulfilled, (state, action) => {
        state.detailedAppointments.push(action.payload);
      })
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        const updatedAppointment = action.payload as any; // 👈 Explicitly type action.payload
      
        state.detailedAppointments = state.detailedAppointments.map((appt) =>
          appt.appointmentId === updatedAppointment.appointmentId ? updatedAppointment : appt
        );
      })
      .addCase(deleteAppointmentThunk.fulfilled, (state, action) => {
        state.detailedAppointments = state.detailedAppointments.filter((appt) => appt.appointmentId !== action.payload);
      })
      .addCase(webSocketUpdateThunk.fulfilled, (state, action) => {
        state.weeklyAppointments = action.payload.updatedWeeklyAppointments;
      });
  },
});

// ✅ Export Actions & Reducer
export const {
  setWeeklyAppointments,
  setAppointmentDetails,
  updateAppointmentField,
  updateAppointmentState,
  resetAppointment,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;