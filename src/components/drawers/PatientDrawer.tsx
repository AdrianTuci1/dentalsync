import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import PatientService from '../../services/patientService';

interface PatientDrawerProps {
  patientId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedPatient: any) => void;
}

const PatientDrawer: React.FC<PatientDrawerProps> = ({ patientId, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [patientData, setPatientData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const token = useSelector((state: any) => state.auth.subaccountToken); // Access the token from Redux

  const patientService = new PatientService(token, 'demo_db');

  // Reset patient data when drawer is opened for adding a new patient
  useEffect(() => {
    if (isOpen && !patientId) {
      setPatientData({}); // Reset fields to empty for new patient
      setActiveTab(0); // Reset to the first tab
    }
  }, [isOpen, patientId]);

  // Fetch patient data when drawer opens and patientId is provided
  useEffect(() => {
    const fetchPatientData = async () => {
      if (patientId && isOpen && token) {
        setLoading(true);
        try {
          const data = await patientService.getPatient(patientId);
          setPatientData(data);
          console.log(data);
        } catch (error) {
          console.error('Failed to fetch patient data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientData();
  }, [patientId, isOpen, token]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setPatientData({ ...patientData, [field]: event.target.value });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(patientData);
    }
    onClose();
  };

  const tabs = ['Details', 'Dental History', 'Gallery', 'Appointments', 'Delete'];

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            {patientData.name || 'Add Patient'}
          </Typography>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          {tabs.map((tab, index) => (
            <Tab label={tab} key={index} />
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
              {activeTab === 1 && <DentalHistoryTab />}
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
