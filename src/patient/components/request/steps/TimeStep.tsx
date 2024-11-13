// TimeStep.tsx
import React, { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import './TimeStep.scss';

interface TimeStepProps {
  selectedDate: Date | null;
  onTimeSelect: (time: string) => void;
}

const TimeStep: React.FC<TimeStepProps> = ({ selectedDate, onTimeSelect }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    onTimeSelect(time); // Directly call onTimeSelect here
  };

  return (
    <div className="time-step">
      <Typography variant="subtitle1" className="step-title">
        Schedule Your Appointment
      </Typography>
      <Typography variant="h4" className="pick-time-title">
        Choose a Time
      </Typography>
      <Typography variant="body2" className="selected-date">
        {selectedDate
          ? selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Select a date first'}
      </Typography>
      <div className="time-slots">
        {timeSlots.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleTimeClick(time)}
            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
          >
            {time}
          </Button>
        ))}
      </div>
      <Box className="timezone-info">
        <Typography variant="caption" color="textSecondary">
          Pacific Time - US & Canada (12:09PM)
        </Typography>
      </Box>
    </div>
  );
};

export default TimeStep;
