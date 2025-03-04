import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/shared/services/store";
import UnifiedDataService from "../services/unifiedDataService";

// Define state for medics.
export interface MedicState {
  medicsList: any[]; // Table Data (Paginated)
  detailedMedics: any[]; // Detailed Drawer Data (Limited to 20)
  loading: boolean;
  error: string | null;
  offset: number;
}

const initialState: MedicState = {
  medicsList: [],
  detailedMedics: [],
  loading: false,
  error: null,
  offset: 0,
};

// ✅ Fetch Medics (Paginated)
export const fetchMedics = createAsyncThunk(
  "medics/fetch",
  async ({ name = "", offset = 0 }: { name?: string; offset?: number }, { rejectWithValue, extra }) => {
    const { token, db } = extra as { token: string; db: string };

    console.log(`📡 Fetching medics for clinic: ${db} (Offset: ${offset})`);

    try {
      const service = UnifiedDataService.getInstance(token, db);
      const result = await service.getResources("medics", { name, offset: String(offset) });

      return { data: result.data || [], offset };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch medics");
    }
  }
);

// ✅ Fetch Medic by ID
export const fetchMedicById = createAsyncThunk(
  "medics/fetchById",
  async (id: string, { rejectWithValue, extra }) => {
    const { token, db } = extra as { token: string; db: string };
    console.log(`🔎 Fetching medic ID: ${id} from clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);
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
  async (medic: Partial<any>, { rejectWithValue, extra }) => {
    const { token, db } = extra as { token: string; db: string };
    console.log(`🆕 Creating medic in clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);
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
  async ({ id, medic }: { id: string; medic: Partial<any> }, { rejectWithValue, extra }) => {
    const { token, db } = extra as { token: string; db: string };
    console.log(`✏️ Updating medic ID: ${id} in clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);
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
  async (id: string, { rejectWithValue, extra }) => {
    const { token, db } = extra as { token: string; db: string };
    console.log(`🗑️ Deleting medic ID: ${id} in clinic: ${db}`);

    try {
      const service = UnifiedDataService.getInstance(token, db);
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
    setMedicsList: (state, action: PayloadAction<any[]>) => {
      state.medicsList = action.payload;
    },
    setDetailedMedic: (state, action: PayloadAction<any>) => {
      const existingIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
      if (existingIndex !== -1) {
        state.detailedMedics[existingIndex] = action.payload;
      } else {
        state.detailedMedics = [action.payload, ...state.detailedMedics].slice(0, 20);
      }
    },
    // ✅ Update a medic in the table (Optimistic UI)
    setUpdatedMedicInTable: (state, action: PayloadAction<any>) => {
      const index = state.medicsList.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.medicsList[index] = action.payload;
      } else {
        state.medicsList.push(action.payload);
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
        const newMedics: any[] = action.payload.data;

        state.medicsList =
          action.payload.offset === 0
            ? newMedics
            : [...state.medicsList, ...newMedics].reduce(
                (acc, item) => (acc.find((i: any) => i.id === item.id) ? acc : [...acc, item]),
                [] as any[]
              );

        state.offset = action.payload.offset + newMedics.length;
      })
      .addCase(fetchMedics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMedicById.fulfilled, (state, action) => {
        const existingIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
        if (existingIndex !== -1) {
          state.detailedMedics[existingIndex] = action.payload;
        } else {
          state.detailedMedics = [action.payload, ...state.detailedMedics].slice(0, 20);
        }
      })
      .addCase(createMedic.fulfilled, (state, action) => {
        state.medicsList.unshift(action.payload);
        state.detailedMedics = [action.payload, ...state.detailedMedics].slice(0, 20);
      })
      .addCase(updateMedic.fulfilled, (state, action) => {
        state.medicsList = state.medicsList.map((m) => (m.id === action.payload.id ? action.payload : m));
        state.detailedMedics = state.detailedMedics.map((m) => (m.id === action.payload.id ? action.payload : m));
      })
      .addCase(deleteMedic.fulfilled, (state, action) => {
        state.medicsList = state.medicsList.filter((m) => m.id !== action.payload);
        state.detailedMedics = state.detailedMedics.filter((m) => m.id !== action.payload);
      });
  },
});

// Export actions and selectors
export const { setMedicsList, setDetailedMedic, setUpdatedMedicInTable } = medicSlice.actions;
export const selectMedics = (state: RootState) => state.medics.medicsList;
export const selectDetailedMedics = (state: RootState) => state.medics.detailedMedics;
export const selectMedicLoading = (state: RootState) => state.medics.loading;
export const selectMedicError = (state: RootState) => state.medics.error;

export default medicSlice.reducer;