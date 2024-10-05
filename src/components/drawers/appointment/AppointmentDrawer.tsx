import React, { useState, useEffect } from 'react';
import { Drawer, Box, Tabs, Tab } from '@mui/material';
import InitialAppointmentTab from './tabs/InitialAppointmentTab';
import DetailsTab from './tabs/DetailsTab';
import TreatmentsTab from './tabs/TreatmentsTab';
import PriceTab from './tabs/PriceTab';
import DeleteTab from './tabs/DeleteTab';
import { Appointment } from '../../../types/appointmentEvent';

interface AppointmentDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointmentId: string | null, appointmentData: Appointment) => Promise<Appointment>;
  appointment?: Appointment; // Optional for editing existing appointments
}

const AppointmentDrawer: React.FC<AppointmentDrawerProps> = ({
  open,
  onClose,
  onSave,
  appointment,
}) => {
  // Default state for a new appointment
  const initialAppointmentDetails: Appointment = {
    appointmentId: '',
    date: '',
    time: '',
    isDone: false,
    price: 0,
    isPaid: false,
    status: 'upcoming',
    medicUser: '',
    patientUser: '',
    initialTreatment: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [appointmentDetails, setAppointmentDetails] = useState<Appointment>(initialAppointmentDetails);
  const [isNewAppointment, setIsNewAppointment] = useState<boolean>(!appointment); // New appointment flag
  const [activeTab, setActiveTab] = useState<number>(0); // Control which tab is active

  // Set appointment details whenever a new appointment is passed in
  useEffect(() => {
    if (appointment) {
      setAppointmentDetails(appointment);
      setIsNewAppointment(false); // Editing existing appointment
    } else {
      setAppointmentDetails(initialAppointmentDetails); // Reset for new appointment
      setIsNewAppointment(true); // New appointment mode
    }
  }, [appointment]);

  // Handle input changes for appointment details
  const handleInputChange = (field: keyof Appointment, value: any) => {
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Save the initial appointment (for new appointments only)
  const handleSaveInitial = async () => {
    try {
      const newAppointment = await onSave(null, appointmentDetails); // Save the new appointment
      setIsNewAppointment(false); // Switch to edit mode
      setAppointmentDetails(newAppointment); // Update the state with the saved appointment
      setActiveTab(0); // Go to the first tab after saving the initial details
    } catch (error) {
      console.error('Error creating new appointment:', error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: '400px' }}>
      <Box sx={{ width: '100%', padding: 2 }}>
        {isNewAppointment ? (
          <InitialAppointmentTab
            appointmentDetails={appointmentDetails}
            onInputChange={handleInputChange}
            onSave={handleSaveInitial}
            onClose={onClose}
          />
        ) : (
          <>
            {/* Tab Navigation */}
            <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
              <Tab label="Details" />
              <Tab label="Treatments" />
              <Tab label="Price" />
              <Tab label="Delete" />
            </Tabs>

            {/* Tab Content */}
            <Box sx={{ padding: 2 }}>
              {activeTab === 0 && (
                <DetailsTab
                  appointmentDetails={appointmentDetails}
                  onInputChange={handleInputChange}
                />
              )}
              {activeTab === 1 && (
                <TreatmentsTab
                  appointmentId={appointmentDetails.appointmentId}
                  onInputChange={handleInputChange}
                />
              )}
              {activeTab === 2 && (
                <PriceTab
                  appointmentDetails={appointmentDetails}
                  onInputChange={handleInputChange}
                />
              )}
              {activeTab === 3 && (
                <DeleteTab onDelete={() => onSave(appointmentDetails.appointmentId, appointmentDetails)} />
              )}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AppointmentDrawer;
