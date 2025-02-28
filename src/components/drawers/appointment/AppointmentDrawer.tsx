import React, { useEffect, useState } from 'react';
import { Drawer, Box, IconButton } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PaymentsIcon from '@mui/icons-material/Payments';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppSelector } from '@/shared/services/hooks';
import { closeDrawer } from '../../drawerSlice';
import InitialAppointmentTab from './tabs/InitialAppointmentTab';
import DetailsTab from './tabs/DetailsTab';
import TreatmentsTab from './tabs/TreatmentsTab';
import PriceTab from './tabs/PriceTab';
import DeleteTab from './tabs/DeleteTab';

import styles from '@styles-cl/drawers/AppointmentDrawer.module.scss'; // Import CSS file for styling
import { RootState } from '@/shared/services/store';
import { AppointmentRepository } from '@/api/repositories/AppointmentRepository';
import { useDispatch } from 'react-redux';

// Selector for the topmost drawer
const selectDrawerData = (state: RootState) => {
  const topDrawer = state.drawer.drawers[state.drawer.drawers.length - 1];
  return topDrawer?.data || null;
};

const AppointmentDrawer: React.FC = () => {
  const dispatch = useDispatch()
  const drawerData = useAppSelector(selectDrawerData);
  const appointmentId: string | null = drawerData?.appointment?.appointmentId || null;

  const appointmentDetails = useAppSelector(
    (state: RootState) => state.appointments.appointmentDetails
  );

  const [isNewAppointment, setIsNewAppointment] = useState<boolean>(!appointmentId);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (appointmentId) {
      AppointmentRepository.fetchAppointmentById(appointmentId)
        .then((appointment) => {
          AppointmentRepository.updateAppointmentState(appointment);
          setIsNewAppointment(false);
        })
        .catch((error) => {
          console.error("Error fetching appointment:", error);
        });
    } else {
      AppointmentRepository.resetAppointment(); // ✅ Reset appointment state
      setIsNewAppointment(true);
    }
  }, [appointmentId]);


  const handleClose = async (): Promise<void> => {
    console.log("handle close called");
    try {
      if (!isNewAppointment && appointmentId && appointmentDetails) {
        await AppointmentRepository.updateAppointment(appointmentDetails);
        console.log("✅ Appointment successfully updated before closing drawer.");
      }
    } catch (error) {
      console.error("❌ Error updating appointment before closing:", error);
    } finally {
      AppointmentRepository.resetAppointment(); // ✅ Reset state after closing
      dispatch(closeDrawer()); // ✅ Close the drawer after action
    }
  };


  const tabs = [
    { key: 0, icon: <FolderOpenIcon fontSize="medium" />, component: <DetailsTab /> },
    { key: 1, icon: <PostAddIcon fontSize="medium" />, component: <TreatmentsTab /> },
    { key: 2, icon: <PaymentsIcon fontSize="medium" />, component: <PriceTab /> },
    { key: 3, icon: <DeleteIcon fontSize="medium" />, component: <DeleteTab /> },
  ];

  return (
    <Drawer
       anchor="right" 
       open={true} 
       onClose={handleClose}
       ModalProps={{
        BackdropProps: {
          style: { backgroundColor: 'transparent' },
        },}}
       >
      <Box className={styles.drawerContainer}>
        {!appointmentId ? (
          <InitialAppointmentTab />
        ) : (
          <>
            <div className={styles.tabRow}>
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  className={`${styles.tabItem} ${
                    activeTab === tab.key ? styles.activeTabItem : ''
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon}
                  
                </div>
              ))}
              <div className={styles.edge}>
          <IconButton edge="end" onClick={() => dispatch(closeDrawer())}>
            <CloseIcon />
          </IconButton>
          </div>
            </div>

            <Box className={styles.tabContent}>
              {tabs.find((tab) => tab.key === activeTab)?.component}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AppointmentDrawer;
