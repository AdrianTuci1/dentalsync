// ReasonStep.tsx
import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Chip } from '@mui/material';
import './ReasonStep.scss';

interface ReasonStepProps {
  onReasonSelect: (reason: string) => void; // Callback to pass selected reason to parent component
}

const suggestedReasons = [
  'Routine Checkup',
  'Teeth Cleaning',
  'Tooth Pain',
  'Follow-up Appointment',
  'Orthodontic Consultation',
];

const ReasonStep: React.FC<ReasonStepProps> = ({ onReasonSelect }) => {
  const [reason, setReason] = useState('');

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const handleSuggestedReasonClick = (suggestedReason: string) => {
    setReason(suggestedReason);
    onReasonSelect(suggestedReason);
  };

  const handleContinueClick = () => {
    if (reason) onReasonSelect(reason);
  };

  return (
    <div className="reason-step">
      <Typography variant="subtitle1" className="step-title">
        Schedule Your Appointment
      </Typography>
      <Typography variant="h4" className="pick-reason-title">
        Reason for Appointment
      </Typography>
      <TextField
        label="Enter Reason"
        variant="outlined"
        value={reason}
        onChange={handleReasonChange}
        fullWidth
        className="reason-input"
        placeholder="Type your reason for the appointment"
      />
      <Box className="suggested-reasons">
        <Typography variant="body2" className="suggestions-title">
          Or pick a common reason:
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
          {suggestedReasons.map((suggestedReason) => (
            <Chip
              key={suggestedReason}
              label={suggestedReason}
              onClick={() => handleSuggestedReasonClick(suggestedReason)}
              className="suggested-reason-chip"
              color={reason === suggestedReason ? 'primary' : 'default'}
            />
          ))}
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleContinueClick}
        disabled={!reason} // Disable if no reason is entered
        className="continue-button"
      >
        Continue
      </Button>
    </div>
  );
};

export default ReasonStep;
