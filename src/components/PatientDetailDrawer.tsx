import React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Appointment } from '../types/appointmentEvent';

interface PatientDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  patientData: Appointment;
}

const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({ open, onClose, patientData }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '450px', padding: '20px' },
      }}
    >
      <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Request Appointment</h2>
        <IconButton onClick={onClose}>
          x
        </IconButton>
      </div>
      <div className="patient-info" style={{ marginTop: '20px' }}>
        <img src={patientData.patientImage} alt={patientData.patientName} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }} />
        <div>
          <h3>{patientData.patientName}</h3>
          <p>{patientData.phone} • {patientData.email}</p>
        </div>
      </div>
      <div className="patient-reason" style={{ marginTop: '20px' }}>
        <h4>Reason</h4>
        <p>{patientData.reason}</p>
      </div>
      <div className="patient-diagnosis" style={{ marginTop: '20px' }}>
        <h4>Diagnose</h4>
        <p>{patientData.diagnosis}</p>
      </div>
      <div className="pharmacy" style={{ marginTop: '20px' }}>
        <h4>Preferred Pharmacy</h4>
        <div>
          {patientData.preferredPharmacy.map((pharmacy, index) => (
            <Button key={index} variant="outlined" size="small" style={{ marginRight: '10px', marginBottom: '10px' }}>
              {pharmacy}
            </Button>
          ))}
        </div>
      </div>
      <div className="booking-info" style={{ marginTop: '20px' }}>
        <h4>Booking Information</h4>
        <p>{patientData.bookingDate}</p>
        <p>{patientData.appointmentType}</p>
      </div>
      <div className="planning-schedule" style={{ marginTop: '20px' }}>
        <h4>Planning Schedule</h4>
        {patientData.planningSchedule.map((item, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <h5>{item.time}</h5>
            <p><strong>{item.description}</strong></p>
            <p>Doctor: {item.doctor}</p>
            <p>Assistant: {item.assistant}</p>
            <p>Room: {item.room}</p>
          </div>
        ))}
      </div>
      <div className="drawer-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" color="error">
          Decline
        </Button>
        <Button variant="contained" color="primary">
          Approve
        </Button>
      </div>
    </Drawer>
  );
};

export default PatientDetailDrawer;
