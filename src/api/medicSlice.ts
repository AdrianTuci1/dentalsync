import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiMedicData, ApiWorkingDayHour, MedicInfo, MedicsListItem } from "@/features/clinic/types/Medic";
import { createMedicFactory } from "@/factories/medicFactory";
import { cache } from "@/shared/utils/localForage";
import { transformMedicInfoToTableFormat } from "@/shared/utils/medicTransform";

interface MedicState {
  medics: MedicsListItem[]; // ✅ Table Data
  detailedMedics: MedicInfo[]; // ✅ Drawer Data
  loading: boolean;
  error: string | null;
}

const initialState: MedicState = {
  medics: [],
  detailedMedics: [],
  loading: false,
  error: null,
};

// ✅ Fetch all medics (Table Data)
export const fetchMedics = createAsyncThunk(
  "medics/fetch",
  async ({ token, clinicDb }: { token: string; clinicDb: string }, { rejectWithValue }) => {
    const factory = createMedicFactory(token, clinicDb);
    try {
      const medics = await factory.fetchMedics(); // ✅ Returns `MedicsListItem[]`
      await cache.set("medics", medics);
      return medics;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch medics");
    }
  }
);

// ✅ Fetch detailed medic info (Drawer Data)
export const fetchMedicById = createAsyncThunk(
    "medics/fetchById",
    async ({ id, token, clinicDb }: { id: string; token: string; clinicDb: string }, { rejectWithValue }) => {
      const factory = createMedicFactory(token, clinicDb);
  
      try {
        let cachedDetailedMedics: MedicInfo[] = (await cache.get("detailedMedics")) || [];
  
        // **Check if medic is already cached**
        let cachedMedicIndex = cachedDetailedMedics.findIndex((m) => m.id === id);
        if (cachedMedicIndex !== -1) {
          console.log("✅ Returning cached medic data:", cachedDetailedMedics[cachedMedicIndex]);
          return cachedDetailedMedics[cachedMedicIndex]; // ✅ Use cached data
        }
  

        const data: ApiMedicData = await factory.fetchMedicById(id);
  
        // **Format the response**
        const formattedMedic: MedicInfo = {
          id: data.id.toString(),
          info: {
            name: data.name || "",
            email: data.email || "",
            employmentType: data.medicProfile.employmentType || "",
            specialization: data.medicProfile.specialization || "",
            phone: data.medicProfile.phone || "",
            address: data.medicProfile.address || "",
            photo: data.photo || "",
          },
          assignedServices: {
            assignedTreatments: data.medicProfile.assignedTreatments || [],
          },
          workingHours: data.medicProfile.workingDaysHours.reduce(
            (acc: { [day: string]: string }, curr: ApiWorkingDayHour) => {
              acc[curr.day] = `${curr.startTime}-${curr.endTime}`;
              return acc;
            },
            {}
          ),
          daysOff: data.medicProfile.daysOff || [],
          permissions: data.permissions || [],
        };
  
  
        // **Update existing entry if found, else add new one**
        if (cachedMedicIndex !== -1) {
          cachedDetailedMedics[cachedMedicIndex] = formattedMedic; // ✅ Update existing medic
        } else {
          cachedDetailedMedics.push(formattedMedic);
  
          // **Limit cache to 20 entries** (remove oldest if exceeded)
          if (cachedDetailedMedics.length > 20) {
            cachedDetailedMedics.shift(); // ✅ Remove the first (oldest) entry
          }
        }
  
        await cache.set("detailedMedics", cachedDetailedMedics);

  
        return formattedMedic;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch medic details");
      }
    }
  );


// ✅ Create new medic
export const createMedic = createAsyncThunk(
  "medics/create",
  async ({ medic, token, clinicDb }: { medic: Partial<MedicInfo>; token: string; clinicDb: string }, { rejectWithValue }) => {
    const factory = createMedicFactory(token, clinicDb);
    try {
      const newMedic = await factory.createMedic(medic); // ✅ Returns `MedicInfo`
      return newMedic;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create medic");
    }
  }
);

// ✅ Update existing medic
export const updateMedic = createAsyncThunk(
    "medics/update",
    async ({ id, medic, token, clinicDb }: { id: string; medic: Partial<MedicInfo>; token: string; clinicDb: string }, { rejectWithValue }) => {
      const factory = createMedicFactory(token, clinicDb);
      try {
        const updatedMedic = await factory.updateMedic(id, medic);
  
        // **Update the cache entry**
        let cachedDetailedMedics: MedicInfo[] = (await cache.get("detailedMedics")) || [];
        let medicIndex = cachedDetailedMedics.findIndex((m) => m.id === id);
  
        if (medicIndex !== -1) {
          cachedDetailedMedics[medicIndex] = updatedMedic; // ✅ Update in cache
        } else {
          cachedDetailedMedics.push(updatedMedic);
  
          if (cachedDetailedMedics.length > 20) {
            cachedDetailedMedics.shift(); // ✅ Keep only last 20 entries
          }
        }
  
        await cache.set("detailedMedics", cachedDetailedMedics);
        console.log("💾 Updated medic in cache:", cachedDetailedMedics);
  
        return updatedMedic;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to update medic");
      }
    }
  );

// ✅ Delete medic
export const deleteMedic = createAsyncThunk(
  "medics/delete",
  async ({ id, token, clinicDb }: { id: string; token: string; clinicDb: string }, { rejectWithValue }) => {
    const factory = createMedicFactory(token, clinicDb);
    try {
      await factory.deleteMedic(id);
      return id; // ✅ Return deleted medic ID
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete medic");
    }
  }
);

const medicSlice = createSlice({
  name: "medics",
  initialState,
  reducers: {
    // ✅ Store table data
    setMedics: (state, action: PayloadAction<MedicsListItem[]>) => {
      state.medics = action.payload;
    },

    // ✅ Update table when a medic is modified
    setUpdatedMedicInTable: (state, action: PayloadAction<MedicsListItem>) => {
      const index = state.medics.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.medics[index] = action.payload; // ✅ Update medic in table
      } else {
        state.medics.push(action.payload); // ✅ Ensure new medics appear in the table
      }
    },

    // ✅ Store detailed medic info (Drawer Data)
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
      // ✅ Fetch Table Data (MedicsListItem[])
      .addCase(fetchMedics.fulfilled, (state, action) => {
        state.medics = action.payload ?? [];
      })

      // ✅ Fetch Detailed Data (MedicInfo)
      .addCase(fetchMedicById.fulfilled, (state, action) => {
        const existingIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
        if (existingIndex !== -1) {
          state.detailedMedics[existingIndex] = action.payload;
        } else {
          state.detailedMedics.push(action.payload);
        }
      })

      // ✅ Create New Medic (Transform to Table Format)
      .addCase(createMedic.fulfilled, (state, action) => {
        const newMedicTableItem = transformMedicInfoToTableFormat(action.payload);
        state.medics.push(newMedicTableItem);
        state.detailedMedics.push(action.payload);
      })

      // ✅ Update Existing Medic
      .addCase(updateMedic.fulfilled, (state, action) => {
        // ✅ Update Detailed Medic Data
        const detailedIndex = state.detailedMedics.findIndex((m) => m.id === action.payload.id);
        if (detailedIndex !== -1) {
          state.detailedMedics[detailedIndex] = action.payload;
        }

        // ✅ Update Table Format Data
        const tableIndex = state.medics.findIndex((m) => m.id === action.payload.id);
        if (tableIndex !== -1) {
          state.medics[tableIndex] = transformMedicInfoToTableFormat(action.payload);
        }
      })

      // ✅ Delete Medic
      .addCase(deleteMedic.fulfilled, (state, action) => {
        state.medics = state.medics.filter((m) => m.id !== action.payload);
        state.detailedMedics = state.detailedMedics.filter((m) => m.id !== action.payload);
      });
  },
});

// ✅ Export actions
export const { setMedics, setUpdatedMedicInTable, setDetailedMedic } = medicSlice.actions;

// ✅ Export selectors
export const selectMedics = (state: any) => state.medics.medics;
export const selectDetailedMedics = (state: any) => state.medics.detailedMedics;
export const selectMedicLoading = (state: any) => state.medics.loading;
export const selectMedicError = (state: any) => state.medics.error;

// ✅ Export reducer
export default medicSlice.reducer;
export type { MedicState };