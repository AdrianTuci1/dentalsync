// ConfirmationStep.tsx
import React from 'react';
import { Typography, Button, Box } from '@mui/material';

interface ConfirmationStepProps {
  patientName: string;
  reason: string;
  providerName: string;
  location: string;
  date: Date | null;
  time: string | null;
  onConfirm: () => void; // Callback to finalize the appointment
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  patientName,
  reason,
  providerName,
  location,
  date,
  time,
  onConfirm,
}) => {
  return (
    <Box padding={3} textAlign="center">
      <Typography variant="h5" gutterBottom>
        Confirm Your Appointment
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Patient:</strong> {patientName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Reason:</strong> {reason}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Provider:</strong> {providerName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Location:</strong> {location}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Date:</strong> {date ? date.toLocaleDateString() : 'Not selected'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Time:</strong> {time || 'Not selected'}
      </Typography>
      <Button variant="contained" color="primary" onClick={onConfirm} style={{ marginTop: '20px' }}>
        Confirm Appointment
      </Button>
    </Box>
  );
};

export default ConfirmationStep;
