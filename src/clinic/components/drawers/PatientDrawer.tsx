import React, { useState, useEffect } from 'react';
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
import PatientService from '../../../shared/services/patientService';
import { closeDrawer } from '../../../shared/services/drawerSlice';
import styles from '../../styles/drawers/PatientDrawer.module.scss'; // Import CSS module for styling
import { selectTopDrawer } from '../../../shared/utils/selectors';

const PatientDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Access drawer data from Redux
  const { drawerData } = useSelector(selectTopDrawer);
  const patientId = drawerData?.patientId || null;

  const [activeTab, setActiveTab] = useState(0);
  const [patientData, setPatientData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const token = useSelector((state: any) => state.auth.subaccountToken);

  const patientService = new PatientService(token, 'demo_db');

  // Reset patient data when opening for a new patient
  useEffect(() => {
    if (!patientId) {
      setPatientData({});
      setActiveTab(0);
    }
  }, [patientId]);

  // Fetch patient data when opening for an existing patient
  useEffect(() => {
    const fetchPatientData = async () => {
      if (patientId && token) {
        setLoading(true);
        try {
          const data = await patientService.getPatient(patientId);
          setPatientData(data);
        } catch (error) {
          console.error('Failed to fetch patient data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientData();
  }, [patientId, token]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setPatientData((prevData: any) => ({ ...prevData, [field]: event.target.value }));
  };

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const handleSave = async () => {
    try {
      if (patientId) {
        await patientService.updatePatient(patientId, patientData);
      } else {
        await patientService.createPatient(patientData);
      }
      dispatch(closeDrawer());
    } catch (error) {
      console.error('Failed to save patient data:', error);
    }
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
            {patientData.name || 'Add Patient'}
          </Typography>
          <IconButton edge="end" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
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

        {/* Tab Content */}
        <Box className={styles.tabContent}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              {activeTab === 0 && (
                <DetailsTab patientData={patientData} onInputChange={handleInputChange} onSave={handleSave} />
              )}
              {activeTab === 1 && <DentalHistoryTab patientId={'1'} />}
              {activeTab === 2 && <GalleryTab />}
              {activeTab === 3 && <AppointmentsTab patientId={patientData.id} />}
              {activeTab === 4 && <DeleteTab />}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default PatientDrawer;
