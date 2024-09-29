import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  clinicToken: string | null;
  clinicUser: any | null;
  subaccounts: any[];
  subaccountToken: string | null;
  subaccountUser: any | null;
}

const initialState: AuthState = {
  clinicToken: localStorage.getItem('clinicToken'),
  clinicUser: localStorage.getItem('clinicUser') ? JSON.parse(localStorage.getItem('clinicUser') as string) : null,
  subaccounts: localStorage.getItem('subaccounts') ? JSON.parse(localStorage.getItem('subaccounts') as string) : [],
  subaccountToken: localStorage.getItem('subaccountToken'),
  subaccountUser: localStorage.getItem('subaccountUser') ? JSON.parse(localStorage.getItem('subaccountUser') as string) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clinic login success
    clinicLoginSuccess: (
      state,
      action: PayloadAction<{ clinicToken: string; clinicUser: any; subaccounts: any[] }>
    ) => {
      state.clinicToken = action.payload.clinicToken;
      state.clinicUser = action.payload.clinicUser;
      state.subaccounts = action.payload.subaccounts;

      // Store clinic information in localStorage
      localStorage.setItem('clinicToken', action.payload.clinicToken);
      localStorage.setItem('clinicUser', JSON.stringify(action.payload.clinicUser));
      localStorage.setItem('subaccounts', JSON.stringify(action.payload.subaccounts));
    },

    // Subaccount login success
    subaccountLoginSuccess: (
      state,
      action: PayloadAction<{ subaccountToken: string; subaccountUser: any }>
    ) => {
      state.subaccountToken = action.payload.subaccountToken;
      state.subaccountUser = action.payload.subaccountUser;

      // Store subaccount information in localStorage
      localStorage.setItem('subaccountToken', action.payload.subaccountToken);
      localStorage.setItem('subaccountUser', JSON.stringify(action.payload.subaccountUser));
    },

    // Load stored user data from localStorage on page refresh
    loadUserFromLocalStorage: (state) => {
      const clinicToken = localStorage.getItem('clinicToken');
      const clinicUser = localStorage.getItem('clinicUser');
      const subaccounts = localStorage.getItem('subaccounts');
      const subaccountToken = localStorage.getItem('subaccountToken');
      const subaccountUser = localStorage.getItem('subaccountUser');

      if (clinicToken && clinicUser) {
        state.clinicToken = clinicToken;
        state.clinicUser = JSON.parse(clinicUser);
        state.subaccounts = subaccounts ? JSON.parse(subaccounts) : [];
      }

      if (subaccountToken && subaccountUser) {
        state.subaccountToken = subaccountToken;
        state.subaccountUser = JSON.parse(subaccountUser);
      }
    },

    // Logout action to clear both clinic and subaccount data
    logout: (state) => {
      state.clinicToken = null;
      state.clinicUser = null;
      state.subaccounts = [];
      state.subaccountToken = null;
      state.subaccountUser = null;

      // Clear localStorage
      localStorage.removeItem('clinicToken');
      localStorage.removeItem('clinicUser');
      localStorage.removeItem('subaccounts');
      localStorage.removeItem('subaccountToken');
      localStorage.removeItem('subaccountUser');
    },

    switchAccount: (state) => {
      state.subaccountToken = null;
      state.subaccountUser = null;

      localStorage.removeItem('subaccountToken');
      localStorage.removeItem('subaccountUser');
    },
  }
});

export const { clinicLoginSuccess, 
               subaccountLoginSuccess, 
               loadUserFromLocalStorage, 
               logout, 
               switchAccount,
              } = authSlice.actions;

export default authSlice.reducer;
