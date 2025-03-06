import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RequestState {
  openAppointment: boolean;
  step: number;
  userAuthenticated: boolean;
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  selectedReason: string | null; // Adăugăm motivul rezervării
}

const initialState: RequestState = {
  openAppointment: false,
  step: 0,
  userAuthenticated: false,
  selectedDate: null,
  selectedTimeSlot: null,
  selectedReason: null, // Inițial nu este selectat niciun motiv
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    openRequestAppointment: (state) => {
      state.openAppointment = true;
      state.step = 0;
    },
    closeRequestAppointment: (state) => {
      state.openAppointment = false;
      state.step = 0;
      state.selectedDate = null;
      state.selectedTimeSlot = null;
      state.selectedReason = null; // Resetăm selecția
    },
    nextStep: (state) => {
      if (state.step < 3) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 0) state.step -= 1;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.userAuthenticated = action.payload;
      state.step = action.payload ? 1 : 0;
    },
    selectDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    selectTimeSlot: (state, action: PayloadAction<string>) => {
      state.selectedTimeSlot = action.payload;
    },
    selectReason: (state, action: PayloadAction<string>) => {
      state.selectedReason = action.payload; // Salvăm motivul selectat
    },
  },
});

export const {
  openRequestAppointment,
  closeRequestAppointment,
  nextStep,
  prevStep,
  setAuthenticated,
  selectDate,
  selectTimeSlot,
  selectReason,
} = requestSlice.actions;

export default requestSlice.reducer;