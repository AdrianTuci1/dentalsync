// RequestAppointmentButton.tsx
import React, { useState } from 'react';
import { Button, Dialog } from '@mui/material';
import RequestAppointment from '../../patientComponents/request/RequestAppointment';
import '../../../styles/patientDashboard/requestButton.scss';

const RequestAppointmentButton: React.FC = () => {
  const [openAppointment, setOpenAppointment] = useState(false);

  const handleOpenAppointment = () => {
    setOpenAppointment(true);
  };

  const handleCloseAppointment = () => {
    setOpenAppointment(false);
  };

  return (
    <div className="button-cas">
      <Button
        variant="contained"
        color="primary"
        className="request-appointment-button"
        onClick={handleOpenAppointment}
      >
        Request Appointment
      </Button>

      {/* Render the RequestAppointment component in a dialog */}
      <Dialog
        open={openAppointment}
        onClose={handleCloseAppointment}
        fullScreen
      >
        <RequestAppointment onExit={handleCloseAppointment}/>
      </Dialog>
    </div>
  );
};

export default RequestAppointmentButton;
