import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import TreatmentService from '@/api/treatmentService';
import { Treatment } from '@/features/clinic/types/treatmentType';
import { RootState } from '@/shared/services/store';

interface ExtraArgument {
    token: string;
    db: string;
  }



// Thunks
export const fetchTreatments = createAsyncThunk<
  Treatment[], // Return type
  { searchTerm: string; offset: number }, // Argument type
  { state: RootState; extra: { token: string; db: string } } // ThunkAPI type
>(
  'treatments/fetchAll',
  async ({ searchTerm, offset }, { extra }) => {
    const { token, db } = extra;
    const service = new TreatmentService(token, db);
    const response = await service.getAllTreatments(searchTerm, offset);
    return response.treatments;
  }
);

export const updateTreatmentThunk = createAsyncThunk<
  Treatment, // Return type
  Treatment, // Argument type
  { state: RootState; extra: ExtraArgument } // ThunkAPI type
>(
  'treatments/update',
  async (treatment, { extra }) => {
    const { token, db } = extra; // Extract token and db dynamically

    const service = new TreatmentService(token, db);
    const response: any = await service.updateTreatment(treatment.id, treatment);

    console.log('Updated Treatment Response:', response); // Debug log for response
    //ignore this type error
    return response.treatment; // Return the updated treatment object
  }
);

export const createTreatmentThunk = createAsyncThunk<
  Treatment, // Return type
  Partial<Treatment>, // Argument type
  { state: RootState; extra: ExtraArgument } // ThunkAPI type
>(
  'treatments/create',
  async (treatment, { extra }) => {
    const { token, db } = extra; // Extract token and db dynamically

    const service = new TreatmentService(token, db);
    const response: any = await service.createTreatment(treatment);

    console.log('Created Treatment Response:', response); // Debug log for response
    return response.treatment; // Return the created treatment object
  }
);

// Initial State
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

// Slice
const treatmentSlice = createSlice({
  name: 'treatments',
  initialState,
  reducers: {
    addTreatment: (state, action: PayloadAction<Treatment>) => {
      state.treatments.push(action.payload);
    },
    setTreatments: (state, action: PayloadAction<Treatment[]>) => {
      state.treatments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
          // Handle create treatment
      .addCase(createTreatmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTreatmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.treatments.push(action.payload); // Add the created treatment
      })
      .addCase(createTreatmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTreatments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.loading = false;
        state.treatments = action.payload; // Replace existing treatments
      })
      .addCase(fetchTreatments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle update treatment
      .addCase(updateTreatmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTreatmentThunk.fulfilled, (state, action) => {
        state.loading = false;
      
        // Find the treatment to update
        const index = state.treatments.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.treatments[index] = action.payload; // Update the treatment
        } else {
          console.warn(`Treatment with ID ${action.payload.id} not found in state.`);
        }
      
      })
      .addCase(updateTreatmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export Actions
export const { addTreatment, setTreatments } = treatmentSlice.actions;

// Export Selectors
export const selectTreatments = (state: any) => state.treatments.treatments;
export const selectLoading = (state: any) => state.treatments.loading;
export const selectError = (state: any) => state.treatments.error;

// Export Reducer
export default treatmentSlice.reducer;