import React from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/services/hooks';
import { RootState } from '@/shared/services/store';
import AppointmentService from '@/api/services/fetchAppointments';
import { closeDrawer } from '@/components/drawerSlice';
import { resetAppointment } from '@/api/slices/appointmentsSlice';

const DeleteTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.subaccountToken);
  const database = 'demo_db';
  
  // Retrieve the appointmentId from state
  const appointmentId = useAppSelector((state: RootState) => state.appointments.appointmentDetails.appointmentId);

  const appointmentService = new AppointmentService(token || '', database);

  const handleDelete = async () => {
    if (!appointmentId) {
      console.error('No appointmentId available to delete');
      return;
    }

    try {
      // Call the deleteAppointment service directly
      await appointmentService.deleteAppointment(appointmentId);
      console.log('Appointment successfully deleted');

      // After successful deletion, reset and close if needed
      dispatch(resetAppointment());
      dispatch(closeDrawer());
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Appointment</button>
    </div>
  );
};

export default DeleteTab;
