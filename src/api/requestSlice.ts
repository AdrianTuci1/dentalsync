// src/services/appointmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const requestSlice = createSlice({
    name: 'request',
    initialState: { openAppointment: false },
    reducers: {
        openRequestAppointment: (state) => {
            state.openAppointment = true;
        },
        closeRequestAppointment: (state) => {
            state.openAppointment = false;
        },
    },
});

export const { openRequestAppointment, closeRequestAppointment } = requestSlice.actions;
export default requestSlice.reducer;
