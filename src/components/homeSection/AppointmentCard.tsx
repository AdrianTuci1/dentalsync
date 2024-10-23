import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { Appointment } from '../../types/appointmentEvent'; // Adjust import path
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import generateInitials from '../../utils/generateInitials';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const dayLabel = isToday(parseISO(appointment.date))
    ? 'Today'
    : isTomorrow(parseISO(appointment.date))
    ? 'Tomorrow'
    : '';

  return (
    <Paper
      sx={{
        padding: '5px',
        borderRadius: 0,
        borderTop: `1px solid #bdbdbd`,
        width: '100%',
        boxShadow: 'none',
      }}
    >
      {/* Time Slot */}
      <Typography variant="caption" color="textSecondary" sx={{ backgroundColor: '#d0d0d0', padding: '2px', display: 'block', width: '100%', textAlign: 'center' }}>
        {dayLabel} - {appointment.startHour ? format(parseISO(`${appointment.date}T${appointment.startHour}`), 'p') : 'Invalid Time'}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Treatment initials and name */}
        <Box
          sx={{
            width: '50px',
            height: '50px',
            backgroundColor: appointment.color,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '12px',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {generateInitials(appointment.initialTreatment as string)}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{appointment.initialTreatment}</Typography>
          <Typography variant="body2" color="textSecondary">
            {appointment.patientUser}
          </Typography>
        </Box>
        {/* Doctor Avatar and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ marginRight: '8px' }}>{appointment.medicUser.charAt(0)}</Avatar>
          <Typography variant="subtitle2">{appointment.medicUser}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AppointmentCard;
