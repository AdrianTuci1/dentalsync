import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Appointment } from '../types/appointmentEvent';
import DoneIcon from '@mui/icons-material/CheckCircle'; // Green checked checkbox for finished status
import PaidIcon from '@mui/icons-material/AttachMoney'; // Dollar sign for not-paid status
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Hourglass for in-progress or other statuses
import PatientDetailDrawer from './PatientDetailDrawer'; // Drawer component for patient details

interface SpanningSlotCardProps {
  appointment: Appointment;
  slotHeight: number; // The calculated height based on appointment duration
  topPosition: number; // The top position for absolute positioning
  doctorIndex: number; // Index of the doctor to determine horizontal positioning
}

const SpanningSlotCard: React.FC<SpanningSlotCardProps> = ({ appointment, slotHeight, topPosition, doctorIndex }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle opening and closing the drawer
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Determine the card color and icon based on status
  let cardColor = '#e0f7fa'; // Default light blue for in-progress, encounter, registered
  let Icon = HourglassEmptyIcon; // Default to hourglass icon

  if (appointment.status === 'finished') {
    // Use green checked checkbox icon for finished (paid)
    cardColor = '#d4edda'; // Light green for finished and paid
    Icon = DoneIcon;
  } else if (appointment.status === 'not-paid') {
    // Use dollar sign for not-paid
    cardColor = '#f8d7da'; // Red for not-paid
    Icon = PaidIcon;
  }

  return (
    <>
      {/* The appointment card */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // Ensure content is at the top
          alignItems: 'flex-start',
          justifyContent: 'flex-start', // Top-aligned content
          backgroundColor: cardColor,
          padding: '8px',
          height: `${slotHeight}px`, // Dynamically calculated height
          width: '280px', // Adjust the width to fit within the 300px column with padding
          position: 'absolute',
          top: `${topPosition}px`, // Position based on the start hour
          left: `${60 + 300 * doctorIndex}px`, // Position based on the doctor's index
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          cursor: 'pointer',
          zIndex: 10, // Ensure card is above the grid
        }}
        onClick={handleOpenDrawer} // Open the drawer on click
      >
        {/* Left Side with Status Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
          <Icon sx={{ fontSize: '20px', color: appointment.status === 'finished' ? '#28a745' : '#dc3545' }} />
        </Box>

        {/* Middle Column: Patient Name, Time, and Treatment */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {appointment.patientName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            {`${appointment.startHour}:00 - ${appointment.endHour}:00`}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            {appointment.treatmentType}
          </Typography>
        </Box>

        {/* Right Side with Status Text */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#495057' }}>
            { appointment.status === 'finished'
              ? 'Finished'
              : appointment.status === 'in-progress'
              ? 'Doing Treatment'
              : appointment.status === 'not-paid'
              ? 'Not Paid'
              : appointment.status === 'encounter'
              ? 'Encounter'
              : 'Registered'}
          </Typography>
        </Box>
      </Box>

      {/* Drawer for patient details */}
      <PatientDetailDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        patientData={appointment} // Pass the appointment data to the drawer
      />
    </>
  );
};

export default SpanningSlotCard;
