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
import { PatientRepository } from '@/api/repositories/PatientRepository';

const PatientDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { drawerData } = useSelector(selectTopDrawer);
  const patientId = drawerData?.patientId || null;

  const patientRepository = new PatientRepository();

  // ✅ Get detailed patient from Redux
  const patientUser = useSelector((state: any) =>
    state.patients.detailedPatients.find((p: any) => p.id === patientId) || null
  );

  const [activeTab, setActiveTab] = useState(0);

  // ✅ Fetch patient details if not in Redux cache
  useEffect(() => {
    if (patientId && !patientUser) {
      patientRepository.loadPatientById(patientId);
    }
  }, [patientId, patientUser]);

  const handleInputChange = (field: string, value: any) => {
    if (!patientUser) return;
  
    const updatedPatient = {
      ...patientUser,
      ...(field.startsWith("patientProfile.") // ✅ Check if it's inside patientProfile
        ? {
            patientProfile: {
              ...patientUser.patientProfile, // Preserve other profile fields
              [field.replace("patientProfile.", "")]: value, // Update specific field inside patientProfile
            },
          }
        : { [field]: value }), // ✅ Otherwise, update the top-level field
    };
  
    patientRepository.setDetailedPatientDirectly(updatedPatient);
  };

  // ✅ Save Patient (Optimistic Update)
  const handleSave = async () => {
    if (!patientUser) return;

    const sanitizedPayload = {
      email: patientUser.email,
      name: patientUser.name,
      age: parseInt(patientUser.patientProfile?.age, 10) || 0,
      gender: patientUser.patientProfile?.gender || "Other",
      phone: patientUser.patientProfile?.phone || "",
      address: patientUser.patientProfile?.address || "",
      labels: Array.isArray(patientUser.patientProfile?.labels) ? patientUser.patientProfile.labels : [],
      notes: patientUser.patientProfile?.notes || "",
    };

    try {
      if (patientId) {
        // ✅ Update existing patient
        await patientRepository.modifyPatient(patientId, sanitizedPayload);
      } else {
        // ✅ Create new patient
        await patientRepository.addPatient(sanitizedPayload);
      }
      dispatch(closeDrawer());
    } catch (error) {
      console.error("❌ Error saving patient:", error);
    }
  };

  const handleTabChange = (index: number) => setActiveTab(index);
  const handleClose = () => dispatch(closeDrawer());

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