import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '@/features/clinic/types/appointmentEvent';
import AppointmentService from '@/api/services/fetchAppointments';
import { RootState } from '@/shared/services/store';
import { cache } from '@/api/cacheService';


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
      response.status = determineStatus(response);

      // 🔹 Cache detailed appointment (max 50 records)
      const cachedDetails = (await cache.get("detailedAppointments")) || [];
      const updatedDetails = cachedDetails.map(appt =>
        appt.appointmentId === response.appointmentId ? response : appt
      );
      
      // If appointment is missing, add it
      if (!updatedDetails.some(appt => appt.appointmentId === response.appointmentId)) {
        updatedDetails.unshift(response);
      }
      
      // Ensure we only keep the latest 50
      await cache.set("detailedAppointments", updatedDetails.slice(0, 50));

      logDebug("Fetched appointment by ID & updated cache", response);

      return response;
    } catch (error) {
      logDebug("Fetch appointment failed, falling back to cache", appointmentId);
      // 🔹 Fallback to cached data if offline
      const cachedDetails = (await cache.get("detailedAppointments")) || [];
      const cachedAppointment = cachedDetails.find((appt: Appointment) => appt.appointmentId === appointmentId);
      if (cachedAppointment) return cachedAppointment;
      return rejectWithValue('Failed to fetch appointment');
    }
  }
);

// 🔷 **Update appointment (Optimistic Update & Offline Support)**
export const updateAppointment = createAsyncThunk<
  Appointment,
  Partial<Appointment>,
  { state: RootState; rejectValue: string }
>(
  'appointments/updateAppointment',
  async (updatedFields, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.subaccountToken;
    const database = 'demo_db';
    const appointmentService = new AppointmentService(token || '', database);
    const { appointmentDetails } = state.appointments;

    if (!appointmentDetails?.appointmentId) return rejectWithValue('No appointmentId provided');

    try {
      // ✅ API call to update appointment
      const response = await appointmentService.editAppointment(appointmentDetails.appointmentId, updatedFields);
      response.status = determineStatus(response);

      logDebug("✅ Appointment updated via API", response);

      // ✅ Sync changes with state (weekly view updates automatically)
      dispatch(updateAppointmentState(response));

      return response;
    } catch (error) {
      logDebug("⚠️ Failed to update appointment, handling offline mode", updatedFields);

      if (navigator.onLine) {
        console.log("⚡ Offline Mode: Caching update for later sync");

        const offlineUpdates = (await cache.get("offlineUpdates")) || [];
        const updatedOffline = [
          ...offlineUpdates.filter(
            (a: any) => a.appointmentId !== appointmentDetails.appointmentId
          ),
          { ...appointmentDetails, ...updatedFields },
        ];

        await cache.set("offlineUpdates", updatedOffline);

        // ✅ Apply the update optimistically
        const updatedAppointment = { ...appointmentDetails, ...updatedFields };

        dispatch(updateAppointmentState(updatedAppointment));

        return updatedAppointment;
      }

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
  'appointments/createAppointment',
  async ({ appointment, token }, { rejectWithValue }) => {

    const clinicDb = 'demo_db'; // Ensure correct database
    console.log(`🆕 Creating appointment in clinic: ${clinicDb}`);

    try {
      const appointmentService = new AppointmentService(token, clinicDb);
      const newAppointment = await appointmentService.createAppointment(appointment);
      newAppointment.status = determineStatus(newAppointment);

      // 🔹 Cache the new appointment
      const cachedAppointments = (await cache.get("detailedAppointments")) || [];
      const updatedCache = [newAppointment, ...cachedAppointments].slice(0, 50);
      await cache.set("detailedAppointments", updatedCache);

      console.log("✅ Created appointment & updated cache", newAppointment);
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
  'appointments/deleteAppointment',
  async ({ appointmentId, token }, { rejectWithValue }) => {
    const clinicDb = 'demo_db';
    console.log(`🗑️ Deleting appointment ID: ${appointmentId} in clinic: ${clinicDb}`);

    try {
      const appointmentService = new AppointmentService(token, clinicDb);
      await appointmentService.deleteAppointment(appointmentId);

      // 🔹 Remove from cache
      const cachedAppointments = (await cache.get("detailedAppointments")) || [];
      const updatedCache = cachedAppointments.filter((appt: Appointment) => appt.appointmentId !== appointmentId);
      await cache.set("detailedAppointments", updatedCache);

      console.log(`✅ Deleted appointment ID: ${appointmentId} & updated cache`);
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
      logDebug("🔄 Updating `detailedAppointments` and syncing to `weeklyAppointments`", action.payload);
    
      const updatedAppointment = action.payload;
    
      // ✅ Update `detailedAppointments` by modifying only the relevant appointment
      state.detailedAppointments = state.detailedAppointments.map(appt =>
        appt.appointmentId === updatedAppointment.appointmentId ? updatedAppointment : appt
      );
    
      // ✅ Ensure `detailedAppointments` cache is updated
      cache.get("detailedAppointments").then((cachedDetails: Appointment[] = []) => {
        const updatedCache = cachedDetails.map(appt =>
          appt.appointmentId === updatedAppointment.appointmentId ? updatedAppointment : appt
        );
    
        // ✅ If the appointment is missing, add it
        if (!updatedCache.some(appt => appt.appointmentId === updatedAppointment.appointmentId)) {
          updatedCache.unshift(updatedAppointment);
        }
    
        // ✅ Save the updated cache (keep only 50)
        cache.set("detailedAppointments", updatedCache.slice(0, 50));
        logDebug("✅ Updated detailedAppointments cache", updatedCache);
      });
    
      // ✅ Sync `weeklyAppointments` by modifying only the updated appointment, keeping the rest
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
    
      logDebug("✅ Synced detailedAppointments → weeklyAppointments", {
        detailedAppointments: state.detailedAppointments,
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
        state.appointmentDetails = action.payload;
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