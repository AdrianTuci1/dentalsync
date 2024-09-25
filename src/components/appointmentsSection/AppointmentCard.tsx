// src/components/AppointmentCard.tsx

import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Link } from '@mui/material';
import { Appointment } from '../../types/appointmentEvent';
import { format, parse } from 'date-fns';

interface AppointmentCardProps {
  appointment: Appointment;
  onAppointmentClick: (appointment: Appointment) => void;
  onPatientClick: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAppointmentClick,
  onPatientClick,
}) => {
  const {
    status,
    color,
    treatment,
    patientName,
    patientImage,
    medicName,
    startHour,
    endHour,
  } = appointment;

  // Format time
  const formatTime = (time: string): string => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'hh:mm a');
  };

  return (
    <Card
      variant="outlined"
      sx={{
        marginBottom: 1,
        cursor: 'pointer',
        borderTop: `5px solid ${color || '#1976d2'}`,
        '&:hover': {
          backgroundColor: '#e3f2fd',
        },
      }}
      onClick={() => onAppointmentClick(appointment)}
    >
      <CardContent>
        {/* Status */}
        <Typography variant="caption" color="textSecondary">
          {status.toUpperCase()}
        </Typography>

        {/* Treatment */}
        <Typography variant="subtitle1" fontWeight="bold">
          {treatment}
        </Typography>

        {/* Time */}
        <Typography variant="body2" color="textSecondary">
          {formatTime(startHour)} - {formatTime(endHour)}
        </Typography>

        {/* Patient Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 1,
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering AppointmentCard click
            onPatientClick(appointment);
          }}
        >
          <Avatar
            src={patientImage || '/default-patient.png'}
            alt={patientName}
            sx={{ width: 24, height: 24, marginRight: 1 }}
          />
          <Link
            component="button"
            variant="body2"
            onClick={() => onPatientClick(appointment)}
            sx={{ textDecoration: 'underline', color: '#1976d2' }}
          >
            {patientName}
          </Link>
        </Box>

        {/* Medic Info */}
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          Dr. {medicName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
