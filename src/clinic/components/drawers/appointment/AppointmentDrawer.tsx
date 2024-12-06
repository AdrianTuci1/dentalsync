import React, { useEffect, useState } from 'react';
import { Drawer, Box, Tabs, Tab } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../shared/services/hooks';
import { closeDrawer } from '../../../../shared/services/drawerSlice';
import InitialAppointmentTab from './tabs/InitialAppointmentTab';
import DetailsTab from './tabs/DetailsTab';
import TreatmentsTab from './tabs/TreatmentsTab';
import PriceTab from './tabs/PriceTab';
import DeleteTab from './tabs/DeleteTab';
import {
  setAppointmentDetails,
  resetAppointment,
  fetchAppointmentById,
  updateAppointment,
} from '../../../../shared/services/appointmentsSlice';
import { RootState } from '../../../../shared/services/store';

const AppointmentDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const drawerData = useAppSelector((state: any) => state.drawer.drawerData);
  const appointmentId: string | null = drawerData?.appointment?.appointmentId || null;

  const appointmentDetails = useAppSelector(
    (state: RootState) => state.appointments.appointmentDetails
  );

  const [isNewAppointment, setIsNewAppointment] = useState<boolean>(
    !appointmentId
  );
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (appointmentId) {
      dispatch(fetchAppointmentById(appointmentId))
        .unwrap()
        .then((appointment) => {
          dispatch(setAppointmentDetails(appointment));
          setIsNewAppointment(false);
        })
        .catch((error: unknown) => {
          console.error('Error fetching appointment:', error);
        });
    } else {
      dispatch(resetAppointment());
      setIsNewAppointment(true);
    }
  }, [appointmentId, dispatch]);

  const handleClose = async () => {
    try {
      // If it's an existing appointment, update it before closing
      if (!isNewAppointment && appointmentId && appointmentDetails) {
        // Here we assume `updateAppointment` supports partial updates 
        // and `appointmentDetails` contains the fields we want to patch.
        await dispatch(updateAppointment(appointmentDetails)).unwrap();
        console.log('Appointment successfully updated before closing drawer.');
      }
    } catch (error) {
      console.error('Error updating appointment before closing:', error);
    } finally {
      // Close the drawer and reset the appointment state
      dispatch(closeDrawer());
      dispatch(resetAppointment());
    }
  };

  return (
    <Drawer anchor="right" open={true} onClose={handleClose}>
      <Box
        sx={{ width: '100%', padding: 2, justifyContent: 'center', height: '100%' }}
      >
        {!appointmentId ? (
          <InitialAppointmentTab />
        ) : (
          <>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab
                label="Details"
                icon={<img src="/search-file.png" alt="Details" style={{ width: 24 }} />}
              />
              <Tab
                label="Treatments"
                icon={<img src="/treatments.png" alt="Treatments" style={{ width: 24 }} />}
              />
              <Tab
                label="Price"
                icon={<img src="/payments.png" alt="Price" style={{ width: 24 }} />}
              />
              <Tab
                label="Delete"
                icon={<img src="/delete.png" alt="Delete" style={{ width: 24 }} />}
              />
            </Tabs>

            <Box sx={{ padding: 2 }}>
              {activeTab === 0 && <DetailsTab />}
              {activeTab === 1 && <TreatmentsTab />}
              {activeTab === 2 && <PriceTab />}
              {activeTab === 3 && (
                <DeleteTab/>
              )}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AppointmentDrawer;
