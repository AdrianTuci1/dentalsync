import React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Appointment } from '../../types/appointmentEvent';

interface ReservationDetailProps {
  onClose: () => void;
  onOpenMedicalCheckup: () => void;
  patientData: Appointment;
}

const ReservationDetail: React.FC<ReservationDetailProps> = ({ onClose, onOpenMedicalCheckup, patientData }) => {
  return (
    <>
      {/* Header */}
      <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Reservation ID: #{patientData.id}</h2>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* Display patient details */}
      <div className="patient-info" style={{ marginBottom: '20px' }}>
        <h3>{patientData.patientName}</h3>
        <p>{patientData.phone} • {patientData.email}</p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant="outlined" color="primary" onClick={onOpenMedicalCheckup}>
          Add Medical Checkup
        </Button>
        <Button variant="outlined" color="primary">
          Add Medical Record
        </Button>
      </div>
    </>
  );
};

export default ReservationDetail;
