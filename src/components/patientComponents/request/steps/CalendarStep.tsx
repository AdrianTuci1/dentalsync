// CalendarStep.tsx
import React from 'react';
import MultiMonthCalendar from '../../MultiMonthCalendar';
import { Typography } from '@mui/material';

interface CalendarStepProps {
  onDateChange: (date: Date) => void;
  selectedDate: Date | null;
}

const CalendarStep: React.FC<CalendarStepProps> = ({ onDateChange, selectedDate }) => {
  return (
    <div className="calendar-step">
      <Typography variant="subtitle1" className="step-title">
        Schedule Your Appointment
      </Typography>
      <Typography variant="h4" className="pick-day-title">
        Pick a Day for Your Appointment
      </Typography>
      <MultiMonthCalendar onDateChange={onDateChange} selectedDate={selectedDate} />
    </div>
  );
};

export default CalendarStep;
