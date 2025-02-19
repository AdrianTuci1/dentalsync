import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Treatment } from '@/features/clinic/types/treatmentType';
import UnifiedDataService from "../services/unifiedDataService";
import { cache } from '@/shared/utils/localForage';
import { queueOfflineUpdate } from '../syncQueue';

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

// ✅ Fetch Treatments (Using UnifiedDataService)
export const fetchTreatments = createAsyncThunk(
  "treatments/fetch",
  async ({ token, clinicDb }: { token: string; clinicDb: string }, { rejectWithValue }) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const result = await dataService.getResources("treatments", {});
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch treatments");
    }
  }
);

// ✅ Create a New Treatment
export const createTreatment = createAsyncThunk(
  "treatments/create",
  async ({ treatment, token, clinicDb }: { treatment: Partial<Treatment>; token: string; clinicDb: string }, { rejectWithValue }) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const newTreatment = await dataService.createResource("treatments", treatment);
      return newTreatment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create treatment");
    }
  }
);

// ✅ Update a Treatment (Handles Offline Mode)
export const updateTreatment = createAsyncThunk(
  "treatments/update",
  async ({ id, treatment, token, clinicDb }: { id: string; treatment: Partial<Treatment>; token: string; clinicDb: string }, { rejectWithValue }) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const updatedTreatment = await dataService.updateResource("treatments", id, treatment);
      return updatedTreatment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update treatment");
    }
  }
);

// ✅ Delete a Treatment
export const deleteTreatment = createAsyncThunk(
  "treatments/delete",
  async ({ id, token, clinicDb }: { id: string; token: string; clinicDb: string }, { rejectWithValue }) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      await dataService.deleteResource("treatments", id);
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
          new Map(action.payload.map((t) => [t.id, t])).values()
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
