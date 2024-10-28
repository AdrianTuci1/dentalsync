import React from 'react';
import { Button } from '@mui/material';
import '../../../styles/patientDashboard/requestButton.scss';

const RequestAppointmentButton: React.FC = () => {
  // Render the button in a portal to document.body for fixed positioning
  return (
    <div className="button-cas">
      <Button
        variant="contained"
        color="primary"
        className="request-appointment-button"
        onClick={() => console.log('Requesting appointment...')}
      >
        Request Appointment
      </Button>
    </div>
  );
};

export default RequestAppointmentButton;
