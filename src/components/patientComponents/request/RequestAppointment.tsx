// RequestAppointment.tsx
import React, { useState } from 'react';
import { Button, Typography, IconButton, LinearProgress, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarStep from './steps/CalendarStep';
import TimeStep from './steps/TimeStep';
import ReasonStep from './steps/ReasonStep';
import ConfirmationStep from './steps/ConfirmationStep';

interface RequestAppointmentProps {
  onExit: () => void;
}

const RequestAppointment: React.FC<RequestAppointmentProps> = ({ onExit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('');

  const steps = ['Pick a Day', 'Choose a Time', 'Reason for Appointment', 'Confirm Appointment'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleExit = () => onExit();

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    handleNext();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    handleNext();
  };

  const handleReasonSelect = (selectedReason: string) => {
    setReason(selectedReason);
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CalendarStep onDateChange={handleDateChange} selectedDate={selectedDate} />;
      case 1:
        return <TimeStep selectedDate={selectedDate} onTimeSelect={handleTimeSelect} />;
      case 2:
        return <ReasonStep onReasonSelect={handleReasonSelect} />;
      case 3:
        return (
          <ConfirmationStep
            patientName="John Doe"
            reason={reason}
            providerName="Dr. Smith"
            location="Main Clinic"
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleExit}
          />
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  const progress = (activeStep / (steps.length - 1)) * 100;

  return (
    <div className="request-appointment" style={{ display: 'flex', overflow: 'auto', flexDirection: 'column' }}>
      <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {activeStep > 0 ? (
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <Button onClick={handleExit} color="secondary">
            Exit
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !selectedDate) ||
            (activeStep === 1 && !selectedTime) ||
            (activeStep === 2 && !reason)
          }
        >
          {activeStep === steps.length - 1 ? 'Confirm' : 'Continue'}
        </Button>
      </div>

      {/* Linear Progress Indicator */}
      <Box width="100%" mt={1} mb={3} px={2}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <div className="step-content">{renderStepContent(activeStep)}</div>
    </div>
  );
};

export default RequestAppointment;
