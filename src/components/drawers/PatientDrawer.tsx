import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import DetailsTab from './patient/DetailsTab';
import DentalHistoryTab from './patient/DentalHistoryTab';
import GalleryTab from './patient/GalleryTab';
import AppointmentsTab from './patient/AppointmentsTab';
import DeleteTab from './patient/DeleteTab';
import { closeDrawer } from '@/components/drawerSlice';
import styles from '@styles-cl/drawers/PatientDrawer.module.scss'; // Import CSS module for styling
import { selectTopDrawer } from '@/shared/utils/selectors';
import { createPatientUser, fetchPatientUser, updatePatientUser } from '@/api/patientUserSlice';
import { PatientProfile } from '@/features/clinic/types/patient';

const PatientDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Access drawer data from Redux
  const { drawerData } = useSelector(selectTopDrawer);
  const patientId = drawerData?.patientId || null;

  const [activeTab, setActiveTab] = useState(0);

  const [patientUser, setPatientUser] = useState<any>(null);


  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientUser(patientId) as any)
        .unwrap()
        .then((data: PatientProfile) => setPatientUser(data))
        .catch(console.error);
    }
  }, [dispatch, patientId]);

  const handleInputChange = (field: string, value: any) => {
    setPatientUser((prev: any) => ({
      ...prev,
      [field.includes('.') ? field.split('.')[0] : field]: field.includes('.')
        ? {
            ...prev[field.split('.')[0]],
            [field.split('.')[1]]: value,
          }
        : value,
    }));
  };

  const handleSave = () => {
    if (patientUser) {
      // Prepare payload to match the server's expectations
      const sanitizedPayload = {
        email: patientUser.email,
        name: patientUser.name,
        age: parseInt(patientUser.patientProfile?.age, 10) || 0, // Ensure age is a number
        gender: patientUser.patientProfile?.gender || 'Other',
        phone: patientUser.patientProfile?.phone || '',
        address: patientUser.patientProfile?.address || '',
        labels: Array.isArray(patientUser.patientProfile?.labels)
          ? patientUser.patientProfile.labels
          : [],
        notes: patientUser.patientProfile?.notes || '',
      };
  
      if (patientId) {
        // Update existing patient
        dispatch(updatePatientUser({ id: patientId, data: sanitizedPayload }) as any)
          .unwrap()
          .then(() => console.log('Patient updated successfully'))
          .catch(console.error);
      } else {
        // Create new patient
        dispatch(createPatientUser(sanitizedPayload) as any)
          .unwrap()
          .then(() => console.log('Patient created successfully'))
          .catch(console.error);
      }
    }
    console.log(patientUser)
  };
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const tabs = [
    { label: 'Details', icon: <img src="/info.png" alt="Details" /> },
    { label: 'Dental History', icon: <img src="/dental-record.png" alt="History" /> },
    { label: 'Gallery', icon: <img src="/galery.png" alt="Gallery" /> },
    { label: 'Appointments', icon: <img src="/appointments.png" alt="Appointments" /> },
    { label: 'Delete', icon: <img src="/delete.png" alt="Delete" /> },
  ];

  return (
    <Drawer anchor="right" open={true} onClose={handleClose}>
      <Box className={styles.drawerContainer}>
        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="subtitle1" className={styles.title}>
            {patientUser?.id ? `${patientUser.name}` : 'Add Patient'}
          </Typography>
          <IconButton edge="end" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        {patientUser?.id && (
          <Box className={styles.tabRow}>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`${styles.tabItem} ${
                  activeTab === index ? styles.activeTabItem : ''
                }`}
                onClick={() => handleTabChange(index)}
              >
                {tab.icon}
              </div>
            ))}
          </Box>
        )}


        {/* Tab Content */}
        <Box className={styles.tabContent}>
          {activeTab === 0 &&           
          <DetailsTab
            patientUser={patientUser}
            onInputChange={handleInputChange}
            onSave={handleSave}
          />}
          {activeTab === 1 && <DentalHistoryTab patientId={patientId} />}
          {activeTab === 2 && <GalleryTab />}
          {activeTab === 3 && <AppointmentsTab patientId={patientId} />}
          {activeTab === 4 && <DeleteTab />}
        </Box>
      </Box>
    </Drawer>
  );
};

export default PatientDrawer;