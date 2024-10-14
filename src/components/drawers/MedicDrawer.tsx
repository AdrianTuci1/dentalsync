import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import WorkingHoursStep from '../addMedic/WorkingHoursStep';
import DaysOffStep from '../addMedic/DaysOffStep';
import PermissionsStep from '../addMedic/PermissionsStep';
import InfoTab from '../addMedic/StaffInfoStep';
import TreatmentAccordion from '../addMedic/TreatmentAccordion';
import MedicService from '../../services/medicService';
import { useSelector } from 'react-redux';

import {
  MedicInfo,
  ApiMedicData,
  ApiWorkingDayHour,
  ApiPermission,
  DayOff,
} from '../../types/Medic';

interface MedicDrawerProps {
  open: boolean;
  onClose: () => void;
  medicId?: string | null;
}

const MedicDrawer: React.FC<MedicDrawerProps> = ({ open, onClose, medicId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [medicInfo, setMedicInfo] = useState<MedicInfo>({
    id: undefined,
    info: {
      name: '',
      email: '',
      employmentType: '',
      specialization: '',
      phone: '',
      address: '',
      photo: '',
    },
    assignedServices: {
      assignedTreatments: [],
    },
    workingHours: {},
    daysOff: [],
    permissions: [],
  });

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const medicService = new MedicService(token, 'demo_db');

  useEffect(() => {
    const fetchMedic = async () => {
      if (medicId) {
        try {
          const data: ApiMedicData = await medicService.viewMedic(medicId);

          // Map data into medicInfo
          setMedicInfo({
            id: data.id.toString(),
            info: {
              name: data.name || '',
              email: data.email || '',
              employmentType: data.medicProfile.employmentType || '',
              specialization: data.medicProfile.specialization || '',
              phone: data.medicProfile.phone || '',
              address: data.medicProfile.address || '',
              photo: data.photo || '',
            },
            assignedServices: {
              assignedTreatments: data.medicProfile.assignedTreatments || [],
            },
            workingHours: data.medicProfile.workingDaysHours.reduce(
              (acc: { [day: string]: string }, curr: ApiWorkingDayHour) => {
                acc[curr.day] = `${curr.startTime}-${curr.endTime}`;
                return acc;
              },
              {}
            ),
            daysOff: data.medicProfile.daysOff || [],
            permissions: data.permissions || [], // Assign directly as an array

          });
        } catch (error) {
          console.error('Error fetching medic:', error);
        }
      } else {
        // Reset to initial state for adding a new medic
        setMedicInfo({
          id: undefined,
          info: {
            name: '',
            email: '',
            employmentType: '',
            specialization: '',
            phone: '',
            address: '',
            photo: '',
          },
          assignedServices: {
            assignedTreatments: [],
          },
          workingHours: {},
          daysOff: [],
          permissions: [],
        });
      }
    };
    fetchMedic();
  }, [medicId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInfoChange = (field: string, value: string | File | null) => {
    setMedicInfo((prevInfo) => ({
      ...prevInfo,
      info: {
        ...prevInfo.info,
        [field]: value,
      },
    }));
  };

  const handleServicesChange = (updatedServices: string[]) => {
    setMedicInfo((prevInfo) => ({
      ...prevInfo,
      assignedServices: {
        assignedTreatments: updatedServices,
      },
    }));
  };

  const handleWorkingHoursChange = (day: string, hours: string) => {
    setMedicInfo((prevInfo) => ({
      ...prevInfo,
      workingHours: {
        ...prevInfo.workingHours,
        [day]: hours,
      },
    }));
  };

  const handleDaysOffChange = (updatedDaysOff: DayOff[]) => {
    setMedicInfo((prevInfo) => ({
      ...prevInfo,
      daysOff: updatedDaysOff,
    }));
  };

  const handlePermissionChange = (updatedPermissions: ApiPermission[]) => {
    setMedicInfo((prevInfo) => ({
      ...prevInfo,
      permissions: updatedPermissions,
    }));
  };
  

  const handleSubmit = async () => {
    try {
      if (medicInfo.id) {
        await medicService.updateMedic(medicInfo.id, medicInfo);
      } else {
        await medicService.createMedic(medicInfo);
      }
      onClose();
    } catch (error) {
      console.error('Error saving medic:', error);
    }
  };

  const tabs = ['Info', 'Assigned Services', 'Working Hours', 'Days Off', 'Permissions'];

  const getTabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return <InfoTab info={medicInfo.info} onInfoChange={handleInfoChange} />;
      case 1:
        return (
          <TreatmentAccordion
            assignedTreatments={medicInfo.assignedServices.assignedTreatments}
            onServiceChange={handleServicesChange}
          />
        );
      case 2:
        return <WorkingHoursStep workingHours={medicInfo.workingHours} onWorkingHoursChange={handleWorkingHoursChange} />;
      case 3:
        return <DaysOffStep daysOff={medicInfo.daysOff} onDaysOffChange={handleDaysOffChange} />;
      case 4:
        return <PermissionsStep permissions={medicInfo.permissions} onPermissionsChange={handlePermissionChange} />;
      default:
        return null;
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{medicId ? 'Edit Medic' : 'Add Medic'}</Typography>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" textColor="primary">
          {tabs.map((tab) => <Tab label={tab} key={tab} sx={{ fontSize: '0.85rem' }} />)}
        </Tabs>

        <Box sx={{ p: 2 }}>{getTabContent(activeTab)}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MedicDrawer;
