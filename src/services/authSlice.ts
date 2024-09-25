import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  profiles: Profile[];
  selectedProfile: Profile | null;
  isDemo: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  profiles: [],
  selectedProfile: null,
  isDemo: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfiles(state, action: PayloadAction<Profile[]>) {
      state.profiles = action.payload;
    },
    selectProfile(state, action: PayloadAction<Profile>) {
      state.selectedProfile = action.payload;
    },
    setDemo(state, action: PayloadAction<boolean>) {
      state.isDemo = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProfiles,
  selectProfile,
  setDemo,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
