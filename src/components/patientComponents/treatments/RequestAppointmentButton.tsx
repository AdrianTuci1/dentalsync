import React from 'react';
import { Button } from '@mui/material';
import '../../../styles/patientDashboard/requestButton.scss';

const RequestAppointmentButton: React.FC = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      className="floating-button"
      onClick={() => console.log('Requesting appointment...')}
    >
      Request Appointment
    </Button>
  );
};

export default RequestAppointmentButton;
