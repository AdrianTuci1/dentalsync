import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Treatment } from '@/features/clinic/types/treatmentType';
import UnifiedDataService from "../services/unifiedDataService";
import { RootState } from '@/shared/services/store';

// ✅ Define Extra Argument Type for `createAsyncThunk`
export interface ExtraArg {
  db: string;
  token: string;
}

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

// ✅ Fetch Treatments (Type-Safe `extra`)
export const fetchTreatments = createAsyncThunk<Treatment[], void, { state: RootState; extra: ExtraArg }>(
  "treatments/fetch",
  async (_, { rejectWithValue, extra }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`📡 Fetching treatments for clinic: ${extra.db}`);

      const result = await service.getResources<Treatment>("treatments", {});
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch treatments");
    }
  }
);

// ✅ Create Treatment (Type-Safe `extra`)
export const createTreatment = createAsyncThunk<Treatment, { treatment: Partial<Treatment> }, { state: RootState; extra: ExtraArg }>(
  "treatments/create",
  async ({ treatment }, { rejectWithValue, extra, dispatch, getState }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`🆕 Creating treatment in clinic: ${extra.db}`);

      // ✅ Optimistic Update Before API Call
      const tempId = `temp-${Date.now()}`;
      const optimisticTreatment: Treatment = { ...treatment, id: tempId } as Treatment;
      dispatch(setTreatments([...getState().treatments.treatments, optimisticTreatment]));

      // ✅ API Call
      const savedTreatment = await service.createResource("treatments", treatment);
      return savedTreatment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create treatment");
    }
  }
);

// ✅ Update Treatment (Type-Safe `extra`)
export const updateTreatment = createAsyncThunk<Treatment, { id: string; treatment: Partial<Treatment> }, { state: RootState; extra: ExtraArg }>(
  "treatments/update",
  async ({ id, treatment }, { rejectWithValue, extra, dispatch, getState }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`✏️ Updating treatment ID: ${id} in clinic: ${extra.db}`);

      // ✅ Optimistic UI Update Before API Call
      dispatch(setTreatments(getState().treatments.treatments.map(t => 
        t.id === id ? { ...t, ...treatment } : t
      )));

      // ✅ API Call
      const updatedTreatment = await service.updateResource<Treatment>("treatments", id, treatment);
      return updatedTreatment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update treatment");
    }
  }
);

// ✅ Delete Treatment (Type-Safe `extra`)
export const deleteTreatment = createAsyncThunk<string, { id: string }, { state: RootState; extra: ExtraArg }>(
  "treatments/delete",
  async ({ id }, { rejectWithValue, extra, dispatch, getState }) => {
    try {
      const service = UnifiedDataService.getInstance(extra.db);
      console.log(`🗑️ Deleting treatment ID: ${id} in clinic: ${extra.db}`);

      // ✅ Optimistic UI Update Before API Call
      dispatch(setTreatments(getState().treatments.treatments.filter(t => t.id !== id)));

      // ✅ API Call
      await service.deleteResource("treatments", id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete treatment");
    }
  }
);

// ✅ Treatment Slice (Type-Safe & Preserves Props)
const treatmentSlice = createSlice({
  name: "treatments",
  initialState,
  reducers: {
    setTreatments: (state, action: PayloadAction<Treatment[]>) => {
      console.log("📦 Updating treatments in Redux:", action.payload);
      state.treatments = action.payload.map(existing => {
        const incoming = action.payload.find(t => t.id === existing.id);
        return incoming ? { ...existing, ...incoming } : existing;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.treatments = action.payload;
      })
      .addCase(createTreatment.fulfilled, (state, action) => {
        state.treatments = state.treatments.map(t =>
          t.id.startsWith("temp-") ? action.payload : t
        );
      })
      .addCase(updateTreatment.fulfilled, (state, action) => {
        state.treatments = state.treatments.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        );
      })
      .addCase(deleteTreatment.fulfilled, (state, action) => {
        state.treatments = state.treatments.filter(t => t.id !== action.payload);
      });
  },
});

// ✅ Export Actions
export const { setTreatments } = treatmentSlice.actions;

// ✅ Export Selectors
export const selectTreatments = (state: RootState) => state.treatments.treatments;
export const selectTreatmentLoading = (state: RootState) => state.treatments.loading;
export const selectTreatmentError = (state: RootState) => state.treatments.error;

// ✅ Export Reducer
export default treatmentSlice.reducer;