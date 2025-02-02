import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Treatment } from '@/features/clinic/types/treatmentType';
import { createTreatmentFactory } from "@/factories/treatmentFactory";
import { cache } from '@/shared/utils/localForage';
import { TreatmentUpdater } from '@/shared/utils/TreatmentUpdater';
import { queueOfflineUpdate } from './syncQueue';

interface TreatmentState {
  treatments: Treatment[];
  loading: boolean;
  error: string | null;
}

const initialState: TreatmentState = {
  treatments: [],
  loading: false,
  error: null,
};

// Factory-based Thunks
export const fetchTreatments = createAsyncThunk(
  "treatments/fetch",
  async (
    { token, clinicDb, name }: { token: string; clinicDb: string; name: string },
    { rejectWithValue }
  ) => {
    const factory = createTreatmentFactory(token, clinicDb);
    try {
      const treatments = await factory.fetchTreatments(name);
      await cache.set("treatments", treatments);
      return treatments;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch treatments");
    }
  }
);

export const createTreatment = createAsyncThunk(
  "treatments/create",
  async (
    { treatment, token, clinicDb }: { treatment: Partial<Treatment>; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    const factory = createTreatmentFactory(token, clinicDb);
    try {
      const newTreatment = await factory.createTreatment(treatment);
      const cachedTreatments = await cache.get("treatments");
      const updatedTreatments = [...cachedTreatments, newTreatment];
      await cache.set("treatments", updatedTreatments);
      return newTreatment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create treatment");
    }
  }
);

// Optimistic update thunk for updating a treatment
export const updateTreatment = createAsyncThunk(
  "treatments/update",
  async (
    { id, treatment, token, clinicDb }: { id: string; treatment: Partial<Treatment>; token: string; clinicDb: string },
    { rejectWithValue, dispatch, getState }
  ) => {
    // Get current state
    const state: any = getState();
    const existingTreatments: Treatment[] = state.treatments.treatments || [];

    // Create an optimistic update using the facade
    const optimisticTreatments = TreatmentUpdater.mergeTreatment(existingTreatments, id, treatment);

    // Immediately update Redux and LocalForage
    await cache.set("treatments", optimisticTreatments);
    dispatch(setTreatments(optimisticTreatments));

    // If online, attempt to update the server in the background
    if (navigator.onLine) {
      try {
        const factory = createTreatmentFactory(token, clinicDb);
        const confirmedTreatment = await factory.updateTreatment(id, treatment);
        // Merge confirmed update into the state
        const finalTreatments = TreatmentUpdater.mergeTreatment(optimisticTreatments, id, confirmedTreatment);
        await cache.set("treatments", finalTreatments);
        dispatch(setTreatments(finalTreatments));
        return confirmedTreatment;
      } catch (error) {
        console.error("API update failed:", error);
        return rejectWithValue(error instanceof Error ? error.message : "Failed to update treatment");
      }
    } else {
      // If offline, queue the update and return the optimistic update
      await queueOfflineUpdate({ type: "treatment", action: "update", data: { id, ...treatment } });
      return optimisticTreatments.find((t) => t.id === id);
    }
  }
);


export const deleteTreatment = createAsyncThunk(
  "treatments/delete",
  async (
    { id, token, clinicDb }: { id: string; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    const factory = createTreatmentFactory(token, clinicDb);
    try {
      // Call the API deletion
      await factory.deleteTreatment(id);

      // Retrieve cached treatments and ensure it's an array
      const cachedTreatments = await cache.get("treatments");
      const updatedList = Array.isArray(cachedTreatments)
        ? cachedTreatments.filter((t: Treatment) => t.id !== id)
        : [];

      // Update the cache
      await cache.set("treatments", updatedList);

      // Return the deleted treatment id for the extra reducer
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete treatment");
    }
  }
);

// Slice
const treatmentSlice = createSlice({
  name: "treatments",
  initialState,
  reducers: {
    setTreatments: (state, action: PayloadAction<Treatment[]>) => {
      state.treatments = action.payload;
      cache.set("treatments", state.treatments);
    },
    addTreatment: (state, action: PayloadAction<Treatment>) => {
      console.log("🛠️ Optimistically adding new treatment to Redux:", action.payload);
      state.treatments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreatments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.loading = false;
        state.treatments = action.payload;
      })
      .addCase(fetchTreatments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTreatment.fulfilled, (state, action) => {
        state.treatments.push(action.payload);
      })
      .addCase(deleteTreatment.fulfilled, (state, action) => {
        state.treatments = state.treatments.filter((t) => t.id !== action.payload);
      });
  },
});


export const { setTreatments } = treatmentSlice.actions

// Export actions and selectors
export const selectTreatments = (state: any) => state.treatments.treatments;
export const selectTreatmentLoading = (state: any) => state.treatments.loading;

// Export reducer
export default treatmentSlice.reducer;

// Explicitly export the TreatmentState type
export type { TreatmentState };