import React from 'react';
import { Box, Typography } from '@mui/material';
import { Appointment } from '../../types/appointmentEvent';
import AppointmentCard from './AppointmentCard';

interface WeekViewProps {
  selectedWeek: Date[];
  appointments?: Appointment[]; // Make appointments optional
  onAppointmentClick: (appointment: Appointment) => void;
  onPatientClick: (appointment: Appointment) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  selectedWeek,
  appointments = [], // Default to empty array if undefined
  onAppointmentClick,
  onPatientClick,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 0,
      }}
    >
      {selectedWeek.map((day) => {
        const dayAppointments = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.toDateString() === day.toDateString();
        });

        return (
          <Box
            key={day.toISOString()}
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
                    key={appointment.appointmentId}
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
