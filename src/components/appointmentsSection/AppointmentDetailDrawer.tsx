// src/components/AppointmentDetailDrawer.tsx

import React from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Divider,
  Box,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Appointment } from '../../types/appointmentEvent';
import { format, parse } from 'date-fns';

interface AppointmentDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  appointmentData: Appointment | null;
}

const formatTime = (time: string): string => {
  const parsedTime = parse(time, 'HH:mm:ss', new Date());
  return format(parsedTime, 'hh:mm a');
};

const AppointmentDetailDrawer: React.FC<AppointmentDetailDrawerProps> = ({
  open,
  onClose,
  appointmentData,
}) => {
  if (!appointmentData) return null;

  const {
    status,
    color,
    treatment,
    patientName,
    patientImage,
    medicName,
    startHour,
    endHour,
    details,
    price,
  } = appointmentData;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '80%', sm: '400px' },
          padding: 2,
        },
      }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Typography variant="h6" component="div" gutterBottom>
          Appointment Details
        </Typography>
        <Divider />

        {/* Content */}
        <Box sx={{ mt: 2 }}>
          {/* Status */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Status:</strong> {status.toUpperCase()}
          </Typography>

          {/* Treatment */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Treatment:</strong> {treatment}
          </Typography>

          {/* Time */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Time:</strong> {formatTime(startHour)} - {formatTime(endHour)}
          </Typography>

          {/* Patient Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Avatar
              src={patientImage || '/default-patient.png'}
              alt={patientName}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Typography variant="subtitle1">
              <strong>Patient:</strong> {patientName}
            </Typography>
          </Box>

          {/* Medic Info */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
            <strong>Medic:</strong> Dr. {medicName}
          </Typography>

          {/* Price */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Price:</strong> ${price.toFixed(2)}
          </Typography>

          {/* Details */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Details:</strong> {details || 'N/A'}
          </Typography>

          {/* Additional Fields as Needed */}
        </Box>
      </Box>
    </Drawer>
  );
};

export default AppointmentDetailDrawer;
