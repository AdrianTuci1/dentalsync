// src/services/appointmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
    name: 'appointment',
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

export const { openRequestAppointment, closeRequestAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
