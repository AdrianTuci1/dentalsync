import store from "@/shared/services/store";
import { 
  fetchAppointmentByIdThunk, 
  updateAppointmentThunk, 
  createAppointmentThunk, 
  deleteAppointmentThunk, 
  setWeeklyAppointments,
  setAppointmentDetails,
  updateAppointmentField,
  resetAppointment,
  updateAppointmentState,
} from "@/api/slices/appointmentsSlice";
import type { AnyAction } from "@reduxjs/toolkit"; // ✅ Needed for dispatching typed thunks
import type { ThunkDispatch } from "redux-thunk"; // ✅ Needed for extra argument typing
import type { RootState } from "@/shared/services/store"; // ✅ Import RootState

export class AppointmentRepository {
  private static dispatch: ThunkDispatch<RootState, { token: string; db: string }, AnyAction> = store.dispatch;

  static async fetchAppointmentById(appointmentId: string) {
    return await this.dispatch(fetchAppointmentByIdThunk(appointmentId));
  }

  static async updateAppointment(appointmentDetails: any) {
    return await this.dispatch(updateAppointmentThunk(appointmentDetails));
  }

  static async createAppointment(appointmentDetails: any) {
    return await this.dispatch(createAppointmentThunk(appointmentDetails));
  }

  static async deleteAppointment(appointmentId: string) {
    return await this.dispatch(deleteAppointmentThunk(appointmentId));
  }

  static setWeeklyAppointments(data: any[]) {
    this.dispatch(setWeeklyAppointments(data));
  }

  static setAppointmentDetails(appointmentDetails: any) {
    this.dispatch(setAppointmentDetails(appointmentDetails));
  }

  static updateAppointmentField(field: string, value: any) {
    this.dispatch(updateAppointmentField({ field, value }));
  }

  static updateAppointmentState(appointmentDetails: any) {
    this.dispatch(updateAppointmentState(appointmentDetails));
  }

  static resetAppointment() {
    this.dispatch(resetAppointment());
  }
}