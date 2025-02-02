import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SyncState {
  isSyncing: boolean;
  offlineQueueCount: number;
}

const initialState: SyncState = {
  isSyncing: false,
  offlineQueueCount: 0,
};

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    startSync: (state) => {
      state.isSyncing = true;
    },
    finishSync: (state) => {
      state.isSyncing = false;
    },
    setOfflineQueueCount: (state, action: PayloadAction<number>) => {
      state.offlineQueueCount = action.payload;
    },
  },
});

export const { startSync, finishSync, setOfflineQueueCount } = syncSlice.actions;


export type { SyncState };
export default syncSlice.reducer;