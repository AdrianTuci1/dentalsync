import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAndCachePermissions } from "./permissionHelper";
import { ApiPermission } from "../../clinic/types/Medic";

interface PermissionsState {
  permissions: ApiPermission[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: PermissionsState = {
  permissions: [],
  status: "idle",
};

// Async thunk to load permissions
export const loadPermissions = createAsyncThunk(
  "permissions/load",
  async ({ token, database }: { token: string; database: string }) => {
    return await fetchAndCachePermissions(token, database);
  }
);

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPermissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadPermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.permissions = action.payload;
      })
      .addCase(loadPermissions.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default permissionsSlice.reducer;