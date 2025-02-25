import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Treatment } from '@/features/clinic/types/treatmentType';
import UnifiedDataService from "../services/unifiedDataService";
import { cache } from '@/shared/utils/localForage';
import { RootState } from '@/shared/services/store';
import { getSubdomain } from '@/shared/utils/getSubdomains';

export interface TreatmentState {
  treatments: Treatment[];
  loading: boolean;
  error: string | null;
}

const initialState: TreatmentState = {
  treatments: [],
  loading: false,
  error: null,
};

// ✅ Fetch Treatments with Proper Caching
export const fetchTreatments = createAsyncThunk(
  "treatments/fetch",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`📡 Fetching treatments for clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const result = await service.getResources("treatments", {});

      // ✅ Merge new treatments with cache to prevent overwriting
      const cachedTreatments = (await cache.get("treatments")) || [];
      const mergedTreatments = [...cachedTreatments, ...result.data].reduce(
        (acc, item) => acc.find((i: any) => i.id === item.id) ? acc : [...acc, item], [] as any[]
      );

      await cache.set("treatments", mergedTreatments);
      return mergedTreatments;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch treatments");
    }
  }
);

// ✅ Create Treatment with Optimistic Update
export const createTreatment = createAsyncThunk(
  "treatments/create",
  async ({ treatment, token }: { treatment: Partial<Treatment>; token: string }, { rejectWithValue, dispatch }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🆕 Creating treatment in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);

      // 🔹 Optimistic UI Update: Add treatment to cache before API call
      const cachedTreatments = (await cache.get("treatments")) || [];
      const newTreatment: Treatment = {
        ...treatment,
        id: `temp-${Date.now()}`, // Temporary ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Treatment;

      const updatedCache = [newTreatment, ...cachedTreatments].slice(0, 20);
      await cache.set("treatments", updatedCache);
      dispatch(setTreatments(updatedCache));

      // ✅ Send API request
      const savedTreatment = await service.createResource("treatments", treatment);
      return savedTreatment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create treatment");
    }
  }
);

// ✅ Update Treatment with Proper Cache & API Sync
export const updateTreatment = createAsyncThunk(
  "treatments/update",
  async ({ id, treatment, token }: { id: string; treatment: Partial<Treatment>; token: string }, { rejectWithValue, dispatch, getState }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`✏️ Updating treatment ID: ${id} in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const state = getState() as RootState;
      const existingTreatments: Treatment[] = state.treatments.treatments || [];

      // 🔹 Optimistic UI Update: Update treatment in cache before API call
      const optimisticUpdate = { ...treatment, id };
      const updatedCache = existingTreatments.map((t) => (t.id === id ? { ...t, ...optimisticUpdate } : t));

      await cache.set("treatments", updatedCache);
      dispatch(setTreatments(updatedCache));

      // ✅ Send API request
      const updatedTreatment = await service.updateResource("treatments", id, optimisticUpdate);
      return updatedTreatment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update treatment");
    }
  }
);

// ✅ Delete Treatment with Proper Optimistic Handling
export const deleteTreatment = createAsyncThunk(
  "treatments/delete",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue, dispatch, getState }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🗑️ Deleting treatment ID: ${id} in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const state = getState() as RootState;
      const existingTreatments: Treatment[] = state.treatments.treatments || [];

      // 🔹 Optimistic UI Update: Remove treatment from cache before API call
      const updatedCache = existingTreatments.filter((t) => t.id !== id);
      await cache.set("treatments", updatedCache);
      dispatch(setTreatments(updatedCache));

      // ✅ Send API request
      await service.deleteResource("treatments", id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete treatment");
    }
  }
);

// ✅ Slice
const treatmentSlice = createSlice({
  name: "treatments",
  initialState,
  reducers: {
    setTreatments: (state, action: PayloadAction<Treatment[]>) => {
      state.treatments = action.payload;
      cache.set("treatments", state.treatments);
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Treatments
      .addCase(fetchTreatments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.loading = false;

        // Ensure unique treatments based on id
        const uniqueTreatments = Array.from(
          new Map(action.payload.map((t: any) => [t.id, t])).values()
        );

        state.treatments = uniqueTreatments;
      })
      .addCase(fetchTreatments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Create Treatment
      .addCase(createTreatment.fulfilled, (state, action) => {
        state.treatments.unshift(action.payload);
      })

      // ✅ Update Treatment
      .addCase(updateTreatment.fulfilled, (state, action) => {
        const index = state.treatments.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.treatments[index] = action.payload;
        }
      })

      // ✅ Delete Treatment
      .addCase(deleteTreatment.fulfilled, (state, action) => {
        state.treatments = state.treatments.filter((t) => t.id !== action.payload);
      });
  },
});

// ✅ Export Actions
export const { setTreatments } = treatmentSlice.actions;

// ✅ Export Selectors
export const selectTreatments = (state: any) => state.treatments.treatments;
export const selectTreatmentLoading = (state: any) => state.treatments.loading;
export const selectTreatmentError = (state: any) => state.treatments.error;

// ✅ Export Reducer
export default treatmentSlice.reducer;
