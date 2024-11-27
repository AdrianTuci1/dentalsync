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


// trebuie trimis medicId pentru a putea modifica requestul

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
    treatments: [], // Default empty treatments array
  };

  const [appointmentDetails, setAppointmentDetails] = useState<Appointment>(initialAppointmentDetails);
  const [isNewAppointment, setIsNewAppointment] = useState<boolean>(!appointment);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Set appointment details whenever a new appointment is passed in
  useEffect(() => {
    if (appointment) {
      setAppointmentDetails(appointment);
      setIsNewAppointment(false);
    } else {
      setAppointmentDetails(initialAppointmentDetails);
      setIsNewAppointment(true);
    }
  }, [appointment]);

  // Handle input changes for appointment details
  const handleInputChange = (field: string, value: any) => {
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [field as keyof Appointment]: value, // Type assertion here
    }));
  };

  // Save logic (stub for now)
  const handleSave = async () => {
    try {
      console.log('Saving appointment:', appointmentDetails);
      dispatch(closeDrawer());
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  return (
    <Drawer anchor="right" open={true} onClose={() => dispatch(closeDrawer())}>
      <Box sx={{ width: '100%', padding: 2, justifyContent: 'center', height: '100%' }}>
        {isNewAppointment ? (
          <InitialAppointmentTab
            appointmentDetails={appointmentDetails}
            onInputChange={handleInputChange}
            onSave={() => console.log('Save new appointment')}
            onClose={() => dispatch(closeDrawer())}
          />
        ) : (
          <>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Details" icon={<img src="/search-file.png" alt="Details" style={{ width: 24 }} />}/>
              <Tab label="Treatments" icon={<img src="/treatments.png" alt="Treatments" style={{ width: 24 }} />}/>
              <Tab label="Price" icon={<img src="/payments.png" alt="Price" style={{ width: 24 }} />}/>
              <Tab label="Delete" icon={<img src="/delete.png" alt="Delete" style={{ width: 24 }} />}/>
            </Tabs>

            <Box sx={{ padding: 2 }}>
              {activeTab === 0 && (
                <DetailsTab
                  appointmentDetails={appointmentDetails}
                  onInputChange={handleInputChange}
                />
              )}
              {activeTab === 1 && (
                <TreatmentsTab
                  treatments={appointmentDetails.treatments || []}
                  onInputChange={handleInputChange}
                />
              )}
              {activeTab === 2 && (
                <PriceTab
                  appointmentDetails={appointmentDetails}
                  onInputChange={handleInputChange}
                />
              )}
              {activeTab === 3 && <DeleteTab onDelete={() => console.log('Delete appointment')} />}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <button onClick={handleSave}>Save</button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AppointmentDrawer;
