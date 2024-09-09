import React, { useState } from 'react';
import SlotCard from './SlotCard';
import PatientDetailDrawer from './PatientDetailDrawer'; // Now using PatientDetailDrawer directly
import { Appointment } from '../types/appointmentEvent';

interface SlotCardWithDrawerProps {
  appointment: Appointment;
  children?: React.ReactNode; // For small images
}

const SlotCardWithDrawer: React.FC<SlotCardWithDrawerProps> = ({ appointment, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <div onClick={handleOpenDrawer} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {/* Display the SlotCard or the small image */}
        {children ? children : <SlotCard appointment={appointment} />}
      </div>
      <PatientDetailDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        patientData={appointment}
      />
    </>
  );
};

export default SlotCardWithDrawer;
