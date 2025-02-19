import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MedicInfo, MedicsListItem } from "@/features/clinic/types/Medic";
import UnifiedDataService from "../services/unifiedDataService";
import { transformMedicInfoToTableFormat } from "@/shared/utils/medicTransform";

// Define state for medics.
export interface MedicState {
  medics: MedicsListItem[];       // Table Data
  detailedMedics: MedicInfo[];     // Drawer Data
  loading: boolean;
  error: string | null;
}

const initialState: MedicState = {
  medics: [],
  detailedMedics: [],
  loading: false,
  error: null,
};

/** 
 * Thunk to fetch medics for the table.
 * Uses UnifiedDataService.getResources for the "medics" resource.
 * Expects a normalized response with shape { data: any[], offset, limit }.
 * Then transforms each raw medic into a MedicsListItem.
 */
export const fetchMedics = createAsyncThunk(
  "medics/fetch",
  async (
    { token, clinicDb }: { token: string; clinicDb: string; name?: string; offset?: number },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      // Call getResources for the "medics" resource.
      const result = await dataService.getResources("medics", {}) as any;
      console.log("UnifiedDataService.getResources result:", result);

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch medics"
      );
    }
  }
);

/** 
 * Thunk to fetch detailed medic info for the drawer.
 * Uses UnifiedDataService.getResourceById for the "medics" resource.
 */
export const fetchMedicById = createAsyncThunk(
  "medics/fetchById",
  async (
    { id, token, clinicDb }: { id: string; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const medic = await dataService.getResourceById("medics", id);
      // No transformation is applied here—you may adjust if needed.
      console.log(medic)
      return medic;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch medic details"
      );
    }
  }
);

/** ✅ Create new medic */
export const createMedic = createAsyncThunk(
  "medics/create",
  async (
    { medic, token, clinicDb }: { medic: Partial<MedicInfo>; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    // For creation, you can keep using your existing factory method if desired.
    // Here, we'll use UnifiedDataService for consistency.
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const newMedic = await dataService.createResource("medics", medic);
      return newMedic;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create medic"
      );
    }
  }
);

/** ✅ Update existing medic */
export const updateMedic = createAsyncThunk(
  "medics/update",
  async (
    { id, medic, token, clinicDb }: { id: string; medic: Partial<MedicInfo>; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      const updatedMedic = await dataService.updateResource("medics", id, medic);
      return updatedMedic;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update medic"
      );
    }
  }
);

/** ✅ Delete medic */
export const deleteMedic = createAsyncThunk(
  "medics/delete",
  async (
    { id, token, clinicDb }: { id: string; token: string; clinicDb: string },
    { rejectWithValue }
  ) => {
    try {
      const dataService = new UnifiedDataService(token, clinicDb);
      await dataService.deleteResource("medics", id);
      return id; // Return deleted medic ID.
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete medic"
      );
    }
  }
);

const medicSlice = createSlice({
  name: "medics",
  initialState,
  reducers: {
    // Store table data.
    setMedics: (state, action: PayloadAction<MedicsListItem[]>) => {
      state.medics = action.payload;
    },
    // Update a medic in the table.
    setUpdatedMedicInTable: (state, action: PayloadAction<MedicsListItem>) => {
      const index = state.medics.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.medics[index] = action.payload;
      } else {
        state.medics.push(action.payload);
      }
    },
    // Store detailed medic info (drawer data).
    setDetailedMedic: (state, action: PayloadAction<MedicInfo>) => {
      const existingIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
      if (existingIndex !== -1) {
        state.detailedMedics[existingIndex] = action.payload;
      } else {
        state.detailedMedics.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedics.fulfilled, (state, action) => {
        state.loading = false;
      
        // Ensure action.payload.data is an array.
        const newMedics: any[] = Array.isArray(action.payload.data) ? action.payload.data : [];
      
        // If offset is 0, replace; otherwise, merge the new data with the existing array.
        const combined = action.payload.offset === 0
          ? newMedics
          : [...state.medics, ...newMedics];
      
        // Deduplicate based on unique 'id' field.
        const deduplicated = Array.from(
          new Map(combined.map((medic) => [medic.id, medic])).values()
        );
      
        state.medics = deduplicated;
      })
      .addCase(fetchMedics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Detailed Medic Data
      .addCase(fetchMedicById.fulfilled, (state, action) => {
        const existingIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
        if (existingIndex !== -1) {
          state.detailedMedics[existingIndex] = action.payload;
        } else {
          state.detailedMedics = [action.payload, ...state.detailedMedics].slice(0, 20);
        }
      })
      // Create Medic
      .addCase(createMedic.fulfilled, (state, action) => {
        // Transform the new medic for table display.
        const newMedicTableItem = transformMedicInfoToTableFormat(action.payload);
        state.medics.push(newMedicTableItem);
        state.detailedMedics.push(action.payload);
      })
      // Update Medic
      .addCase(updateMedic.fulfilled, (state, action) => {
        // Update detailed medic data.
        const detailedIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
        if (detailedIndex !== -1) {
          state.detailedMedics[detailedIndex] = action.payload;
        }
        // Update table display data.
        const tableIndex = state.medics.findIndex((m) => m.id === action.payload.id);
        if (tableIndex !== -1) {
          state.medics[tableIndex] = transformMedicInfoToTableFormat(action.payload);
        }
      })
      // Delete Medic
      .addCase(deleteMedic.fulfilled, (state, action) => {
        state.medics = state.medics.filter((m) => m.id !== action.payload);
        state.detailedMedics = state.detailedMedics.filter((m) => m.id !== action.payload);
      });
  },
});

// Export actions and selectors.
export const { setMedics, setUpdatedMedicInTable, setDetailedMedic } = medicSlice.actions;
export const selectMedics = (state: any) => state.medics.medics;
export const selectDetailedMedics = (state: any) => state.medics.detailedMedics;
export const selectMedicLoading = (state: any) => state.medics.loading;
export const selectMedicError = (state: any) => state.medics.error;

export default medicSlice.reducer;