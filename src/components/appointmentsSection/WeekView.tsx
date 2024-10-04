import React from 'react';
import { Box, Typography } from '@mui/material';
import { Appointment } from '../../types/appointmentEvent';
import AppointmentCard from './AppointmentCard';

interface WeekViewProps {
  selectedWeek: Date[];
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onPatientClick: (appointment: Appointment) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  selectedWeek,
  appointments,
  onAppointmentClick,
  onPatientClick,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 0, // No spacing between the columns
      }}
    >
      {selectedWeek.map((day) => {
        const dayAppointments = appointments.filter((appointment) => {
          // Ensure that appointment.date is parsed as a Date object if it's not already
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.toDateString() === day.toDateString();
        });

        return (
          <Box
            key={day.toISOString()} // Use day.toISOString() as the unique key for each day
            sx={{
              border: '1px solid #ccc',
              backgroundColor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* Date Header */}
            <Box sx={{ padding: '8px 0', backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" align="center">
                {day.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            </Box>

            {/* Appointments List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {dayAppointments.length > 0 ? (
                dayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.appointmentId} // Ensure appointmentId exists in Appointment type
                    appointment={appointment}
                    onAppointmentClick={onAppointmentClick}
                    onPatientClick={onPatientClick}
                  />
                ))
              ) : (
                <Box sx={{ color: '#999', textAlign: 'center', padding: '16px' }}>
                  No Appointments
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default WeekView;
