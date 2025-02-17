// src/types.ts
import { AuthState } from '@/api/slices/authSlice';
import { DrawerState } from '@/components/drawerSlice';
import { AppointmentsState } from '@/api/slices/appointmentsSlice';
import { StockState } from '@/api/slices/stockSlice';
import { TreatmentState } from '@/api/slices/treatmentSlice';
import { PatientUserState } from '@/api/slices/patientUserSlice';
import { PermissionsState } from '@/api/slices/permissionsSlice';
import { SyncState } from '@/api/syncSlice';
import { MedicState } from '@/api/slices/medicSlice';

export interface RootState {
  auth: AuthState;
  drawer: DrawerState;
  appointments: AppointmentsState;
  stocks: StockState;
  treatments: TreatmentState;
  patientUser: PatientUserState;
  permissions: PermissionsState;
  sync: SyncState;
  medic: MedicState;
}