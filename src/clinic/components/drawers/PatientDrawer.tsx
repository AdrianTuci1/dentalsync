import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  Box,
  Typography,
  Tabs,
  Tab,
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

const PatientDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Access drawer data from Redux
  const { drawerData } = useSelector((state: any) => state.drawer);
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
    { label: 'Details', icon: <img src="/search-file.png" alt="Details" style={{ width: 24 }} /> },
    { label: 'Dental History', icon: <img src="/dental-record.png" alt="History" style={{ width: 24 }} /> },
    { label: 'Galery', icon: <img src="/galery.png" alt="Gallery" style={{ width: 24 }} /> },
    { label: 'Appointments', icon: <img src="/rescheduling.png" alt="Appointments" style={{ width: 24 }} /> },
    { label: 'Delete', icon: <img src="/delete.png" alt="Delete" style={{ width: 24 }} /> },
  ];
  

  return (
    <Drawer anchor="right" open={true} onClose={handleClose}>
      <Box sx={{ width: 400 }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            {patientData.name || 'Add Patient'}
          </Typography>
          <IconButton edge="end" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          {tabs.map((tab, index) => (
            <Tab key={index} icon={tab.icon} />
          ))}
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 2 }}>
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
