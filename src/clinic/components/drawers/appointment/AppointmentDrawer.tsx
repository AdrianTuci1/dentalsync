import React, { useState, useEffect } from 'react';
import { Drawer, Box, Tabs, Tab } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer } from '../../../../shared/services/drawerSlice';
import InitialAppointmentTab from './tabs/InitialAppointmentTab';
import DetailsTab from './tabs/DetailsTab';
import TreatmentsTab from './tabs/TreatmentsTab';
import PriceTab from './tabs/PriceTab';
import DeleteTab from './tabs/DeleteTab';
import { Appointment } from '../../../types/appointmentEvent';

const AppointmentDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Access appointment data from Redux
  const { drawerData } = useSelector((state: any) => state.drawer);
  const appointment: Appointment | null = drawerData?.appointment || null;

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
  const [activeTab, setActiveTab] = useState<number>(0); // Control active tab

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
      // Replace this with your actual save logic
      console.log('Saving new appointment:', appointmentDetails);
      setIsNewAppointment(false); // Switch to edit mode
      setActiveTab(0); // Go to the first tab after saving initial details
    } catch (error) {
      console.error('Error creating new appointment:', error);
    }
  };

  // Save existing appointment
  const handleSave = async () => {
    try {
      // Replace this with your actual save logic
      console.log('Updating appointment:', appointmentDetails);
      dispatch(closeDrawer()); // Close the drawer after saving
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  // Delete appointment
  const handleDelete = async () => {
    try {
      // Replace this with your actual delete logic
      console.log('Deleting appointment:', appointmentDetails.appointmentId);
      dispatch(closeDrawer()); // Close the drawer after deleting
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <Drawer anchor="right" open={true} onClose={() => dispatch(closeDrawer())} sx={{ width: '400px' }}>
      <Box sx={{ width: '100%', padding: 2, justifyContent: 'center', height: '100%' }}>
        {isNewAppointment ? (
          <InitialAppointmentTab
            appointmentDetails={appointmentDetails}
            onInputChange={handleInputChange}
            onSave={handleSaveInitial}
            onClose={() => dispatch(closeDrawer())}
          />
        ) : (
          <>
            {/* Tab Navigation */}
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
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
                <DeleteTab onDelete={handleDelete} />
              )}
            </Box>

            {/* Save Button */}
            {activeTab !== 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <button onClick={handleSave}>Save</button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AppointmentDrawer;
