import React from 'react';
import { useAppSelector } from '@/shared/services/hooks';

import { AppointmentRepository } from '@/api/repositories/AppointmentRepository';

const DeleteTab: React.FC = () => {
  // Retrieve the appointmentId from state
  const appointmentId = useAppSelector(
    (state: any) => state.appointments.detailedAppointments.find(
      (appt: any) => appt.appointmentId === state.appointments.activeAppointmentId
    )?.appointmentId
  );

  const handleDelete = async () => {
    if (!appointmentId) {
      console.error("❌ No appointmentId available to delete.");
      return;
    }

    try {
      // ✅ Call deleteAppointment from Repository
      await AppointmentRepository.deleteAppointment(appointmentId);
      console.log("🗑️ Appointment successfully deleted.");

      // ✅ Reset appointment details and close drawer
      AppointmentRepository.setAppointmentDetails(null);
      AppointmentRepository.setWeeklyAppointments([]);
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Appointment</button>
    </div>
  );
};

export default DeleteTab;
