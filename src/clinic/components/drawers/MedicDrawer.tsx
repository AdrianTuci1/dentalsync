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
import WorkingHoursStep from './addMedic/WorkingHoursStep';
import DaysOffStep from './addMedic/DaysOffStep';
import PermissionsStep from './addMedic/PermissionsStep';
import InfoTab from './addMedic/StaffInfoStep';
import TreatmentAccordion from './addMedic/TreatmentAccordion';
import MedicService from '../../../shared/services/medicService';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../../../shared/services/drawerSlice';

import {
  MedicInfo,
  ApiMedicData,
  ApiWorkingDayHour,
} from '../../types/Medic';

const MedicDrawer: React.FC = () => {
  const dispatch = useDispatch();

  const { drawerData, isOpen } = useSelector((state: any) => state.drawer);
  const medicId = drawerData?.medicId || null;

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

  // Fetch or reset medic details on medicId change
  useEffect(() => {
    const fetchMedic = async () => {
      if (medicId) {
        try {
          const data: ApiMedicData = await medicService.viewMedic(medicId);
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
            permissions: data.permissions || [],
          });
        } catch (error) {
          console.error('Error fetching medic:', error);
        }
      } else {
        // Reset form for new medic
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

  const handleChange = (field: string, value: any) => {
    setMedicInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (medicInfo.id) {
        await medicService.updateMedic(medicInfo.id, medicInfo);
      } else {
        await medicService.createMedic(medicInfo);
      }
      dispatch(closeDrawer());
    } catch (error) {
      console.error('Error saving medic:', error);
    }
  };

  const tabs = ['Info', 'Assigned Services', 'Working Hours', 'Days Off', 'Permissions'];

  const getTabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return <InfoTab info={medicInfo.info} onInfoChange={(field, value) => handleChange('info', { ...medicInfo.info, [field]: value })} />;
      case 1:
        return (
          <TreatmentAccordion
            assignedTreatments={medicInfo.assignedServices.assignedTreatments}
            onServiceChange={(updatedServices) => handleChange('assignedServices', { assignedTreatments: updatedServices })}
          />
        );
      case 2:
        return (
          <WorkingHoursStep
            workingHours={medicInfo.workingHours}
            onWorkingHoursChange={(day, hours) => handleChange('workingHours', { ...medicInfo.workingHours, [day]: hours })}
          />
        );
      case 3:
        return <DaysOffStep daysOff={medicInfo.daysOff} onDaysOffChange={(updatedDaysOff) => handleChange('daysOff', updatedDaysOff)} />;
      case 4:
        return <PermissionsStep permissions={medicInfo.permissions} onPermissionsChange={(updatedPermissions) => handleChange('permissions', updatedPermissions)} />;
      default:
        return null;
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={() => dispatch(closeDrawer())}>
      <Box sx={{ width: 400 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{medicId ? 'Edit Medic' : 'Add Medic'}</Typography>
          <IconButton edge="end" onClick={() => dispatch(closeDrawer())}>
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
