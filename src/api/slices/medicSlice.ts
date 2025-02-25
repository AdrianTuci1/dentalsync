import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MedicInfo, MedicsListItem } from "@/features/clinic/types/Medic";
import UnifiedDataService from "../services/unifiedDataService";
import { transformMedicInfoToTableFormat } from "@/shared/utils/medicTransform";
import { getSubdomain } from "@/shared/utils/getSubdomains";
import { RootState } from "@/shared/services/store";


// Define state for medics.
export interface MedicState {
  medics: MedicsListItem[]; // Table Data
  detailedMedics: MedicInfo[]; // Drawer Data
  loading: boolean;
  error: string | null;
}

const initialState: MedicState = {
  medics: [],
  detailedMedics: [],
  loading: false,
  error: null,
};

// ✅ Fetch Medics
export const fetchMedics = createAsyncThunk(
  "medics/fetch",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`📡 Fetching medics for clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const result = await service.getResources("medics", {});
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch medics");
    }
  }
);

// ✅ Fetch Medic by ID
export const fetchMedicById = createAsyncThunk(
  "medics/fetchById",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🔎 Fetching medic ID: ${id} from clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const medic = await service.getResourceById("medics", id);
      return medic;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch medic details");
    }
  }
);

// ✅ Create Medic
export const createMedic = createAsyncThunk(
  "medics/create",
  async ({ medic, token }: { medic: Partial<MedicInfo>; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🆕 Creating medic in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const newMedic = await service.createResource("medics", medic);
      return newMedic;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create medic");
    }
  }
);

// ✅ Update Medic
export const updateMedic = createAsyncThunk(
  "medics/update",
  async ({ id, medic, token }: { id: string; medic: Partial<MedicInfo>; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`✏️ Updating medic ID: ${id} in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      const updatedMedic = await service.updateResource("medics", id, medic);
      return updatedMedic;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update medic");
    }
  }
);

// ✅ Delete Medic
export const deleteMedic = createAsyncThunk(
  "medics/delete",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    const clinicDb = getSubdomain() + "_db";
    console.log(`🗑️ Deleting medic ID: ${id} in clinic: ${clinicDb}`);

    try {
      const service = UnifiedDataService.getInstance(token, clinicDb);
      await service.deleteResource("medics", id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete medic");
    }
  }
);

const medicSlice = createSlice({
  name: "medics",
  initialState,
  reducers: {
    setMedics: (state, action: PayloadAction<MedicsListItem[]>) => {
      state.medics = action.payload;
    },
    setUpdatedMedicInTable: (state, action: PayloadAction<MedicsListItem>) => {
      const index = state.medics.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.medics[index] = action.payload;
      } else {
        state.medics.push(action.payload);
      }
    },
    setDetailedMedic: (state, action: PayloadAction<MedicInfo>) => {
      const existingIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
      if (existingIndex !== -1) {
        state.detailedMedics[existingIndex] = action.payload;
      } else {
        state.detailedMedics = [action.payload, ...state.detailedMedics].slice(0, 20);
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
        const newMedics: any[] = Array.isArray(action.payload.data) ? action.payload.data : [];

        state.medics = [...state.medics, ...newMedics].reduce(
          (acc, item) => (acc.find((i: any) => i.id === item.id) ? acc : [...acc, item]),
          [] as MedicsListItem[]
        );
      })
      .addCase(fetchMedics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMedicById.fulfilled, (state, action) => {
        state.detailedMedics = [action.payload, ...state.detailedMedics].slice(0, 20);
      })
      .addCase(createMedic.fulfilled, (state, action) => {
        state.medics.unshift(transformMedicInfoToTableFormat(action.payload));
        state.detailedMedics.unshift(action.payload);
      })
      .addCase(updateMedic.fulfilled, (state, action) => {
        state.medics = state.medics.map((m) => (m.id === action.payload.id ? transformMedicInfoToTableFormat(action.payload) : m));
        state.detailedMedics = state.detailedMedics.map((m) => (m.id === action.payload.id ? action.payload : m));
      })
      .addCase(deleteMedic.fulfilled, (state, action) => {
        state.medics = state.medics.filter((m) => m.id !== action.payload);
        state.detailedMedics = state.detailedMedics.filter((m) => m.id !== action.payload);
      });
  },
});

// Export actions and selectors
export const { setMedics, setUpdatedMedicInTable, setDetailedMedic } = medicSlice.actions;
export const selectMedics = (state: RootState) => state.medics.medics;
export const selectDetailedMedics = (state: RootState) => state.medics.detailedMedics;
export const selectMedicLoading = (state: RootState) => state.medics.loading;
export const selectMedicError = (state: RootState) => state.medics.error;

export default medicSlice.reducer;