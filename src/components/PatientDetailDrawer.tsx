import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Appointment } from '../types/appointmentEvent';
import ReservationDetail from './reservationDetails/ReservationDetail';
import MedicalCheckup from './reservationDetails/MedicalCheckup';

interface PatientDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  patientData: Appointment;
}

const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({ open, onClose, patientData }) => {
  const [checkupDrawerOpen, setCheckupDrawerOpen] = useState(false);

  // Handler to open the MedicalCheckup drawer
  const handleOpenMedicalCheckup = () => {
    setCheckupDrawerOpen(true);
  };

  // Handler to close the MedicalCheckup drawer
  const handleCloseMedicalCheckup = () => {
    setCheckupDrawerOpen(false);
  };

  return (
    <>
      {/* Patient Detail Box (ReservationDetail Drawer) */}
      <Box
        sx={{
          position: 'fixed',
          right: open ? (checkupDrawerOpen ? '-350px' : '0px') : '-450px', // Leaves 100px visible when checkupDrawerOpen is true
          top: 0,
          bottom: 0,
          width: '450px',
          padding: '20px',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'right 0.3s ease',
          zIndex: 1200,
        }}
      >
        <ReservationDetail
          onClose={onClose} 
          onOpenMedicalCheckup={handleOpenMedicalCheckup} 
          patientData={patientData} 
        />
      </Box>

      {/* Medical Checkup Box */}
      <Box
        sx={{
          position: 'fixed',
          right: checkupDrawerOpen ? '150px' : '-600px', // The new drawer slides in 50px away from the previous drawer
          top: 0,
          bottom: 0,
          width: '450px',
          padding: '20px',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'right 0.3s ease',
          zIndex: 1300,
        }}
      >
        <MedicalCheckup onClose={handleCloseMedicalCheckup} />
      </Box>
    </>
  );
};

export default PatientDetailDrawer;
