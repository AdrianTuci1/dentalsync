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

interface DayOff {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  repeatYearly: boolean;
}

interface MedicInfo {
  id?: number;
  info: {
    name: string;
    email: string;
    employmentType: string;
    specialization: string;
    phone: string;
    address: string;
    photo: string;
  };
  assignedServices: {
    assignedTreatments: string[];
  };
  workingHours: {
    [day: string]: string;
  };
  daysOff: DayOff[];
  permissions: {
    personalAppointments: boolean;
  };
}

const AddMedicDrawer = ({ open, onClose, medicData }: { open: boolean; onClose: () => void; medicData?: MedicInfo }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [medicInfo, setMedicInfo] = useState<MedicInfo>({
    id: medicData?.id || undefined,
    info: {
      name: medicData?.info?.name || '',
      email: medicData?.info?.email || '',
      employmentType: medicData?.info?.employmentType || '',
      specialization: medicData?.info?.specialization || '',
      phone: medicData?.info?.phone || '',
      address: medicData?.info?.address || '',
      photo: medicData?.info?.photo || '',
    },
    assignedServices: {
      assignedTreatments: medicData?.assignedServices?.assignedTreatments || [],
    },
    workingHours: medicData?.workingHours || {},
    daysOff: medicData?.daysOff || [],
    permissions: medicData?.permissions || { personalAppointments: false },
  });

  useEffect(() => {
    if (medicData) {
      setMedicInfo({
        id: medicData.id,
        info: {
          name: medicData.info.name,
          email: medicData.info.email,
          employmentType: medicData.info.employmentType,
          specialization: medicData.info.specialization,
          phone: medicData.info.phone,
          address: medicData.info.address,
          photo: medicData.info.photo,
        },
        assignedServices: {
          assignedTreatments: medicData.assignedServices.assignedTreatments,
        },
        workingHours: medicData.workingHours,
        daysOff: medicData.daysOff,
        permissions: medicData.permissions,
      });
    }
  }, [medicData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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


  const handlePermissionChange = (permission: string, value: boolean) => {
    setMedicInfo((prevInfo) => ({
      ...prevInfo,
      permissions: {
        ...prevInfo.permissions,
        [permission]: value,
      },
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted with values:', medicInfo);
    // Send the `medicInfo` object to your backend here
  };

  const tabs = ['Info', 'Assigned Services', 'Working Hours', 'Days Off', 'Permissions'];

  const getTabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return (
          <InfoTab
            info={medicInfo.info}
            onInfoChange={handleInfoChange}
          />
        );
      case 1:
        return (
          <TreatmentAccordion
            assignedTreatments={medicInfo.assignedServices.assignedTreatments}
            onServiceChange={handleServicesChange}
          />
        );
      case 2:
        return (
          <WorkingHoursStep
            workingHours={medicInfo.workingHours}
            onTimeChange={handleWorkingHoursChange}
          />

        );
      case 3:
        return (
          <DaysOffStep
            daysOff={medicInfo.daysOff}
            onDaysOffChange={handleDaysOffChange}
          />
        );
      case 4:
        return (
          <PermissionsStep
            permissions={medicInfo.permissions}
            onPermissionChange={handlePermissionChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Add/Edit Medic
          </Typography>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" textColor="primary">
          {tabs.map((tab) => (
            <Tab label={tab} key={tab} sx={{ fontSize: '0.85rem' }} />
          ))}
        </Tabs>

        <Box sx={{ p: 2 }}>{getTabContent(activeTab)}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddMedicDrawer;
