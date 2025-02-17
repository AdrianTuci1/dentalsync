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
import { createPatient, fetchPatientById, setDetailedPatient, updatePatient} from '@/api/slices/patientUserSlice';
import { getSubdomain } from '@/shared/utils/getSubdomains';
import { AppDispatch } from '@/shared/services/store';

const PatientDrawer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get drawer data from Redux
  const { drawerData } = useSelector(selectTopDrawer);
  const patientId = drawerData?.patientId || null;

  // ✅ Get detailed patient from Redux
  const patientUser = useSelector((state: any) =>
    state.patients.detailedPatients.find((p: any) => p.id === patientId) || null
  );

  const [activeTab, setActiveTab] = useState(0);
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = `${getSubdomain()}_db`;

  // ✅ Fetch patient details if not in Redux cache
  useEffect(() => {
    if (patientId && !patientUser) {
      dispatch(fetchPatientById({ id: patientId, token, clinicDb }) as any);
    }
  }, [dispatch, patientId, patientUser, token, clinicDb]);

  // ✅ Handle form changes dynamically
  const handleInputChange = (field: string, value: any) => {
    dispatch(setDetailedPatient({ ...patientUser, [field]: value }));
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
        await dispatch(updatePatient({ id: patientId, patient: sanitizedPayload, token, clinicDb }) as any);
      } else {
        // ✅ Create new patient
        await dispatch(createPatient({ patient: sanitizedPayload, token, clinicDb }) as any);
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