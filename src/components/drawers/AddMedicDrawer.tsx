import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import StaffInfoStep from '../addMedic/StaffInfoStep'; // First tab content
import AssignedServicesStep from '../addMedic/AssignedServicesStep'; // Second tab content
import WorkingHoursStep from '../addMedic/WorkingHoursStep'; // Third tab content
import DaysOffStep from '../addMedic/DaysOffStep'; // Fourth tab content

interface DayOff {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  repeatYearly: boolean;
}

interface FormValues {
  name: string;
  employmentType: string;
  specialist: string;
  phone: string;
  email: string;
  address: string;
  contact: string;
  selectedCosmeticServices: string[];
  selectedTreatmentServices: string[];
  workingHours: {
    [key: string]: { enabled: boolean; startTime: Date | null; endTime: Date | null };
  };
  daysOff: DayOff[];
}

const AddMedicDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState(0); // Track the active tab
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    employmentType: '',
    specialist: '',
    phone: '',
    email: '',
    address: '',
    contact: '',
    selectedCosmeticServices: [],
    selectedTreatmentServices: [],
    workingHours: {
      Monday: { enabled: true, startTime: new Date(), endTime: new Date() },
      Tuesday: { enabled: true, startTime: new Date(), endTime: new Date() },
      Wednesday: { enabled: false, startTime: null, endTime: null },
      Thursday: { enabled: false, startTime: null, endTime: null },
      Friday: { enabled: true, startTime: new Date(), endTime: new Date() },
      Saturday: { enabled: true, startTime: new Date(), endTime: new Date() },
      Sunday: { enabled: true, startTime: new Date(), endTime: new Date() },
    },
    daysOff: [],
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Add new day off
  const handleAddDayOff = (dayOff: {
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    repeatYearly: boolean;
  }) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      daysOff: [...prevValues.daysOff, { ...dayOff, id: `${Math.random()}` }],
    }));
  };

  // Remove day off
  const handleRemoveDayOff = (id: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      daysOff: prevValues.daysOff.filter((dayOff) => dayOff.id !== id),
    }));
  };

  // Toggle repeat yearly
  const handleToggleRepeat = (id: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      daysOff: prevValues.daysOff.map((dayOff) =>
        dayOff.id === id ? { ...dayOff, repeatYearly: !dayOff.repeatYearly } : dayOff
      ),
    }));
  };

  // Event handler for employment type
  const handleEmploymentTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      employmentType: value,
    }));
  };

  // Event handler for specialist
  const handleSpecialistChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      specialist: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted with values: ', formValues);
    // Here you can add form submission logic (e.g., an API call).
  };

  const tabs = ['Staff Info', 'Assigned Services', 'Working Hours', 'Days Off'];

  const getTabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return (
          <StaffInfoStep
            name={formValues.name}
            employmentType={formValues.employmentType}
            specialist={formValues.specialist}
            phone={formValues.phone}
            email={formValues.email}
            address={formValues.address}
            onInputChange={handleInputChange}
            onEmploymentTypeChange={handleEmploymentTypeChange}
            onSpecialistChange={handleSpecialistChange}
            onPhotoUpload={handlePhotoUpload}
          />
        );
      case 1:
        return (
          <AssignedServicesStep
            cosmeticServices={[
              'Teeth Whitening',
              'Dental Veneers',
              'Dental Bonding',
              'Dental Crown',
              'Inlays and Onlays',
              'Dental Implants',
            ]}
            treatmentServices={['Bridges', 'Crowns', 'Fillings', 'Root canal treatment']}
            selectedCosmeticServices={formValues.selectedCosmeticServices}
            selectedTreatmentServices={formValues.selectedTreatmentServices}
            onServiceChange={(serviceType, service) => {
              const selectedServicesKey =
                serviceType === 'cosmetic' ? 'selectedCosmeticServices' : 'selectedTreatmentServices';
              setFormValues((prevValues) => {
                const selectedServices = prevValues[selectedServicesKey];
                const updatedServices = selectedServices.includes(service)
                  ? selectedServices.filter((s) => s !== service)
                  : [...selectedServices, service];
                return { ...prevValues, [selectedServicesKey]: updatedServices };
              });
            }}
          />
        );
      case 2:
        return (
          <WorkingHoursStep
            workingHours={formValues.workingHours}
            onToggleDay={(day) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                workingHours: {
                  ...prevValues.workingHours,
                  [day]: {
                    ...prevValues.workingHours[day],
                    enabled: !prevValues.workingHours[day].enabled,
                  },
                },
              }))
            }
            onTimeChange={(day, type, time) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                workingHours: {
                  ...prevValues.workingHours,
                  [day]: {
                    ...prevValues.workingHours[day],
                    [type]: time,
                  },
                },
              }))
            }
          />
        );
      case 3:
        return (
          <DaysOffStep
            daysOff={formValues.daysOff}
            onAddDayOff={handleAddDayOff}
            onRemoveDayOff={handleRemoveDayOff}
            onToggleRepeat={handleToggleRepeat}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400 }}>
        {/* Drawer Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Add Medic
          </Typography>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          {tabs.map((tab, index) => (
            <Tab label={tab} key={tab} />
          ))}
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 2 }}>{getTabContent(activeTab)}</Box>

        {/* Save Button */}
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
