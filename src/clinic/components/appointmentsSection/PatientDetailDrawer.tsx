// src/components/PatientDetailDrawer.tsx

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


interface PatientDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  patientData: Appointment | null;
}

const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({
  open,
  onClose,
  patientData,
}) => {
  if (!patientData) return null;

  const {
    patientName,
    patientImage,
    details,
    prescription,
    involvedTeeth,
  } = patientData;

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
          Patient Details
        </Typography>
        <Divider />

        {/* Content */}
        <Box sx={{ mt: 2 }}>
          {/* Patient Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={patientImage || '/default-patient.png'}
              alt={patientName}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Typography variant="h6">{patientName}</Typography>
          </Box>

          {/* Details */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Contact Details:</strong> {details || 'N/A'}
          </Typography>

          {/* Prescription */}
          <Typography variant="subtitle1" gutterBottom>
            <strong>Prescription:</strong> {prescription || 'N/A'}
          </Typography>

          {/* Involved Teeth */}
          {involvedTeeth && involvedTeeth.length > 0 && (
            <Typography variant="subtitle1" gutterBottom>
              <strong>Involved Teeth:</strong> {involvedTeeth.join(', ')}
            </Typography>
          )}

          {/* Additional Fields as Needed */}
        </Box>
      </Box>
    </Drawer>
  );
};

export default PatientDetailDrawer;
