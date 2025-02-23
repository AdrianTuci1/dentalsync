import { configureStore } from '@reduxjs/toolkit';
import appointmentsReducer, {
  updateAppointmentField,
  updateAppointmentState,
  setWeeklyAppointments
} from '@/api/slices/appointmentsSlice';
import { Appointment } from '@/features/clinic/types/appointmentEvent';
import { RootState } from '@/shared/services/store';

// ✅ Helper function to transform `detailedAppointments` → `weeklyAppointments`
const transformDetailedToAppointment = (detailedAppointment: Appointment): Appointment => ({
  appointmentId: detailedAppointment.appointmentId,
  date: detailedAppointment.date,
  time: detailedAppointment.time,
  startHour: detailedAppointment.time,
  endHour: "", // Cannot determine without treatment duration
  initialTreatment: detailedAppointment.initialTreatment,
  medicId: detailedAppointment.medicId,
  medicUser: detailedAppointment.medicUser,
  patientId: detailedAppointment.patientId,
  patientUser: detailedAppointment.patientUser,
  color: detailedAppointment.treatments?.[0]?.color || "#FF5733",
  isDone: detailedAppointment.isDone || false,
  isPaid: detailedAppointment.isPaid || false,
  createdAt: detailedAppointment.createdAt || new Date().toISOString(),
  updatedAt: detailedAppointment.updatedAt || new Date().toISOString(),
  treatments: detailedAppointment.treatments || [],
  price: detailedAppointment.price || 0,
  status: detailedAppointment.status,
});

describe('Appointments Reducer', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        appointments: appointmentsReducer
      }
    });
  });

  test('✅ updateAppointmentField updates detailedAppointments and reflects changes in weeklyAppointments', () => {
    // 🔹 Mock Appointment
    const mockAppointment: Appointment = {
      appointmentId: 'AP0006',
      date: '2025-02-20',
      time: '09:00',
      isDone: false,
      isPaid: false,
      status: 'upcoming',
      medicId: 4,
      medicUser: 'Dr. Medicus',
      patientId: 6,
      patientUser: 'John Doe',
      treatmentId: 'T001',
      initialTreatment: 'Teeth Cleaning',
      createdAt: '2025-02-15T23:03:57.340Z',
      updatedAt: '2025-02-21T08:34:23.245Z',
      treatments: [{
        treatmentId: 'T001',
        treatmentName: 'Teeth Cleaning',
        units: 1,
        color: "#FF5733",
        involvedTeeth: [],
        prescription: '',
        details: ''
      }],
      price: 100
    };

    // 🔹 Populate `detailedAppointments`
    store.dispatch(updateAppointmentState(mockAppointment));

    // 🔹 Transform and set `weeklyAppointments`
    const transformedWeekly = transformDetailedToAppointment(mockAppointment);
    store.dispatch(setWeeklyAppointments([transformedWeekly]));

    // 🔹 Fields to update (Example: Change patient)
    store.dispatch(updateAppointmentField({ field: "patientUser", value: "Jane Doe" }));

    // 🔹 Get updated state
    const updatedState = store.getState() as RootState;

    // ✅ Assert `detailedAppointments` contains updated fields
    expect(updatedState.appointments.detailedAppointments).toContainEqual(
      expect.objectContaining({
        appointmentId: 'AP0006',
        patientUser: 'Jane Doe', // Changed from 'John Doe' to 'Jane Doe'
      })
    );

    // ✅ Ensure `weeklyAppointments` also updated
    expect(updatedState.appointments.appointments).toContainEqual(
      expect.objectContaining({
        appointmentId: 'AP0006',
        patientUser: 'Jane Doe',
      })
    );
  });
});