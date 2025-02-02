// src/types.ts
import { AuthState } from '@/api/authSlice';
import { DrawerState } from '@/components/drawerSlice';
import { AppointmentsState } from '@/api/appointmentsSlice';
import { StockState } from '@/api/stockSlice';
import { TreatmentState } from '@/api/treatmentSlice';
import { PatientUserState } from '@/api/patientUserSlice';
import { PermissionsState } from '@/api/permissionsSlice';
import { SyncState } from '@/api/syncSlice';

export interface RootState {
  auth: AuthState;
  drawer: DrawerState;
  appointments: AppointmentsState;
  stocks: StockState;
  treatments: TreatmentState;
  patientUser: PatientUserState;
  permissions: PermissionsState;
  sync: SyncState;
}