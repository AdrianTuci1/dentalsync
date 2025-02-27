import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '@/features/clinic/types/appointmentEvent';
import { RootState } from '@/shared/services/store';
import { cache } from '@/api/cacheService';
import UnifiedDataService from '../services/unifiedDataService';


// 🔹 Debugging Utility
const logDebug = (message: string, data?: any) => {
  console.log(`🛠 DEBUG: ${message}`, data || '');
};


// 🔹 Utility function to determine appointment status
const determineStatus = (appointment: Appointment) => {
  const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)
  
  const isPastDate = appointment.date < today;
  const isUpcoming = appointment.date >= today;

  if (isPastDate) {
    if (!appointment.isDone && !appointment.isPaid) return "missed";  // ❌ Missed: Not done, not paid
    if (appointment.isPaid) return "missed";  // ❌ Missed: Paid but not done
    if (appointment.isDone && !appointment.isPaid) return "notpaid"; // ❌ Not Paid: Done but not paid
  }

  if (isUpcoming) {
    if (!appointment.isDone && !appointment.isPaid) return "upcoming"; // 📅 Upcoming: Default state
    if (appointment.isPaid) return "upcoming";  // 📅 Upcoming: Paid but not done
    if (appointment.isDone && !appointment.isPaid) return "notpaid"; // ❌ Not Paid: Done but not paid
  }

  return "upcoming"; // Default fallback
};

// 🔹 Interface for Redux State
export interface AppointmentsState {
  appointmentDetails: Appointment;
  appointments: Appointment[]; // Weekly appointments from WebSocket
  detailedAppointments: Appointment[]; // Cached detailed appointments (max 50)
  loading: boolean;
  error: string | null;
}

// 🔹 Initial State
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
  appointments: [],
  detailedAppointments: [],
  loading: false,
  error: null,
};



// **🔷 Fetch appointment by ID (Offline Caching)**
export const fetchAppointmentById = createAsyncThunk<
  Appointment | null,
  string,
  { state: RootState; rejectValue: string }
>(
  "appointments/fetchAppointmentById",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.subaccountToken;
      const clinicDb = "demo_db";
      const service = UnifiedDataService.getInstance(token || '', clinicDb);

      console.log(`📡 Fetching appointment ID: ${appointmentId}`);

      const response = await service.getResourceById<Appointment>("appointments", appointmentId);
      
      if (!response) {
        console.warn(`⚠️ Appointment not found: ${appointmentId}`);
        return rejectWithValue("Appointment not found");
      }

      response.status = determineStatus(response);
      return response;
    } catch (error) {
      console.log(`⚠️ Fetch failed, falling back to cache`, appointmentId);

      // 🔹 Fallback to cached data if API fails
      const cachedDetails: Appointment[] = (await cache.get("detailedAppointments")) || [];
      const cachedAppointment = cachedDetails.find(appt => appt?.appointmentId === appointmentId);

      if (cachedAppointment) return cachedAppointment;
      return rejectWithValue("Failed to fetch appointment");
    }
  }
);

// 🔷 **Update appointment (Optimistic Update & Offline Support)**
export const updateAppointment = createAsyncThunk<
  Appointment,
  Partial<Appointment>,
  { state: RootState; rejectValue: string; extra: { token: string; clinicDb: string } }
>(
  "appointments/updateAppointment",
  async (updatedFields, { getState, dispatch, rejectWithValue, extra }) => {
    try {
      const { token, clinicDb } = extra;
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const { appointmentDetails } = getState().appointments;

      // Verifică că avem un appointmentId definit
      if (!appointmentDetails?.appointmentId) {
        console.error("❌ No appointmentId provided");
        return rejectWithValue("No appointmentId provided");
      }

      console.log("📡 Before API call, appointmentId:", appointmentDetails.appointmentId, "Updated fields:", updatedFields);

      // Trimite cererea PATCH către API
      const response = await service.patchResource("appointments", appointmentDetails.appointmentId, updatedFields);
      if (!response) {
        throw new Error("API response was empty");
      }

      // Determină statusul nou al appointment-ului
      response.status = determineStatus(response);
      console.log("✅ API update response:", response);

      // Actualizează starea Redux cu noua valoare
      dispatch(updateAppointmentState(response));

      return response;
    } catch (error) {
      console.error("❌ API update failed:", error);
      return rejectWithValue("Failed to update appointment");
    }
  }
);

// ✅ **Create an Appointment**
export const createAppointment = createAsyncThunk<
  Appointment,
  { appointment: Partial<Appointment>; token: string },
  { state: RootState; rejectValue: string }
>(
  "appointments/createAppointment",
  async ({ appointment, token }, { getState, dispatch, rejectWithValue }) => {
    try {
      const clinicDb = "demo_db";
      console.log(`🆕 Creating appointment in clinic: ${clinicDb}`);

      const service = UnifiedDataService.getInstance(clinicDb, token);
      const newAppointment = await service.createResource("appointments", appointment);
      newAppointment.status = determineStatus(newAppointment);

      const state = getState();
      const updatedWeeklyAppointments = [newAppointment, ...state.appointments.appointments];

      await cache.set("weeklyAppointments", updatedWeeklyAppointments);
      dispatch(setWeeklyAppointments(updatedWeeklyAppointments));

      console.log("✅ Created appointment & updated weekly cache", newAppointment);
      return newAppointment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create appointment");
    }
  }
);

// ✅ **Delete an Appointment**
export const deleteAppointment = createAsyncThunk<
  string,
  { appointmentId: string; token: string },
  { state: RootState; rejectValue: string }
>(
  "appointments/deleteAppointment",
  async ({ appointmentId, token }, { getState, dispatch, rejectWithValue }) => {
    try {
      const clinicDb = "demo_db";
      console.log(`🗑️ Deleting appointment ID: ${appointmentId}`);

      const service = UnifiedDataService.getInstance(clinicDb, token);
      await service.deleteResource("appointments", appointmentId);

      const state = getState();
      const updatedWeeklyAppointments = state.appointments.appointments.filter(
        appt => appt.appointmentId !== appointmentId
      );

      await cache.set("weeklyAppointments", updatedWeeklyAppointments);
      dispatch(setWeeklyAppointments(updatedWeeklyAppointments));

      console.log(`✅ Deleted appointment & updated weekly cache`);
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete appointment");
    }
  }
);


// 🔷 **Convert `detailedAppointments` to `appointments` for Optimistic Updates**
const transformDetailedToAppointment = (detailedAppointment: Appointment): Appointment => ({
  appointmentId: detailedAppointment.appointmentId,
  date: detailedAppointment.date,
  startHour: detailedAppointment.time,  // Ensure correct format
  endHour: "", // We don't have treatment duration
  initialTreatment: detailedAppointment.initialTreatment,
  medicId: detailedAppointment.medicId,
  medicUser: detailedAppointment.medicUser,
  patientId: detailedAppointment.patientId,
  patientUser: detailedAppointment.patientUser,
  color: detailedAppointment.treatments?.[0]?.color || "#FF5733",
  status: detailedAppointment.status, // Keep the correct appointment status
    // ✅ Ensure these properties are retained
    time: detailedAppointment.time, 
    isPaid: detailedAppointment.isPaid, 
    createdAt: detailedAppointment.createdAt, 
    updatedAt: detailedAppointment.updatedAt
});


// **🔷 Slice Definition**
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointmentDetails(state, action: PayloadAction<Appointment>) {
      logDebug("🔄 Setting appointment details & syncing updates", action.payload);
    
      const updatedAppointment = action.payload;
    
      // ✅ Update `appointmentDetails`
      state.appointmentDetails = updatedAppointment;
    
      // ✅ Update `detailedAppointments` if the appointment exists
      state.detailedAppointments = state.detailedAppointments.map(appt =>
        appt.appointmentId === updatedAppointment.appointmentId ? updatedAppointment : appt
      );
    
      // ✅ If appointment is missing, add it
      if (!state.detailedAppointments.some(appt => appt.appointmentId === updatedAppointment.appointmentId)) {
        state.detailedAppointments.unshift(updatedAppointment);
      }
    
      // ✅ Sync to `weeklyAppointments` (modify the specific appointment)
      state.appointments = state.appointments.map(appt =>
        appt.appointmentId === updatedAppointment.appointmentId
          ? transformDetailedToAppointment(updatedAppointment)
          : appt
      );
    
      logDebug("✅ Synced detailedAppointments → weeklyAppointments", {
        detailedAppointments: state.detailedAppointments,
        weeklyAppointments: state.appointments,
      });
    },

    // **1️⃣ Update a single field inside `appointmentDetails`**
    updateAppointmentField<K extends keyof Appointment>(
      state: any,
      action: PayloadAction<{ field: K; value: Appointment[K] }>
    ) {
      state.appointmentDetails[action.payload.field] = action.payload.value;
    },

    updateAppointmentState(state, action: PayloadAction<Appointment>) {
      logDebug("🔄 Updating `weeklyAppointments`", action.payload);
    
      const updatedAppointment = action.payload;
    
      // ✅ Sync `weeklyAppointments` in Redux state
      state.appointments = state.appointments.map(appt =>
        appt.appointmentId === updatedAppointment.appointmentId
          ? transformDetailedToAppointment(updatedAppointment)
          : appt
      );
    
      // ✅ Ensure `weeklyAppointments` cache is updated
      cache.get("weeklyAppointments").then((cachedAppointments: Appointment[] = []) => {
        const updatedWeeklyCache = cachedAppointments.map(appt =>
          appt.appointmentId === updatedAppointment.appointmentId
            ? transformDetailedToAppointment(updatedAppointment)
            : appt
        );
    
        // ✅ If the appointment is missing, add it
        if (!updatedWeeklyCache.some(appt => appt.appointmentId === updatedAppointment.appointmentId)) {
          updatedWeeklyCache.unshift(transformDetailedToAppointment(updatedAppointment));
        }
    
        // ✅ Save the updated weekly cache
        cache.set("weeklyAppointments", updatedWeeklyCache);
        logDebug("✅ Updated weeklyAppointments cache", updatedWeeklyCache);
      });
    
      logDebug("✅ Synced weeklyAppointments", {
        weeklyAppointments: state.appointments,
      });
    },

    removeAppointmentState(state, action: PayloadAction<string>) {
      state.appointments = state.appointments.filter(appt => appt.appointmentId !== action.payload);
      state.detailedAppointments = state.detailedAppointments.filter(appt => appt.appointmentId !== action.payload);
    },
    setWeeklyAppointments(state, action: PayloadAction<Appointment[]>) {
      logDebug("📅 Setting weekly appointments", action.payload);
      state.appointments = action.payload;
    },
    resetAppointment(state) {
      logDebug("🔄 Resetting appointment details");
      state.appointmentDetails = initialState.appointmentDetails;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        if (action.payload) {
          state.appointmentDetails = action.payload;
        } else {
          console.warn("⚠️ No appointment found, resetting to default.");
          state.appointmentDetails = initialState.appointmentDetails; // Ensure default state
        }
      });
  },
});

export const {
  setAppointmentDetails,
  updateAppointmentField,
  updateAppointmentState,
  removeAppointmentState,
  setWeeklyAppointments,
  resetAppointment,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;