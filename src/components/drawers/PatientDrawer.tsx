import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Close as CloseIcon } from '@mui/icons-material';

interface Patient {
  name?: string;
  age?: number;
  gender?: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  labels?: string[];
  notes?: string;
}

interface PatientDrawerProps {
  patient?: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDrawer: React.FC<PatientDrawerProps> = ({ patient, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [patientData, setPatientData] = useState<Patient>(patient || {});
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    info: true,
    contact: true,
    others: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  const handleInputChange = (field: keyof Patient) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    let value: any = event.target.value;
    if (field === 'age') {
      value = Number(value);
    } else if (field === 'labels') {
      value = (value as string).split(',').map((label) => label.trim());
    }
    setPatientData({ ...patientData, [field]: value });
  };

  const tabs = ['Details', 'Dental History', 'Gallery', 'Appointments', 'Delete'];

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400 }}>
        {/* Patient Header with Close Button */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <img
            src={patientData.avatarUrl || 'default-avatar.png'}
            alt="Patient Avatar"
            style={{ width: 60, height: 60, borderRadius: '50%', marginRight: 16 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {patientData.name || 'Patient'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {patientData.gender || 'Male'}, {patientData.age ? `${patientData.age} years old` : '0 years old'}
            </Typography>
          </Box>
          <IconButton edge="end" onClick={onClose} aria-label="close">
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
        <Box sx={{ p: 2 }}>
          {activeTab === 0 && (
            // Details Tab Content
            <>
              {/* Info Accordion */}
              <Accordion
                expanded={expanded.info}
                onChange={handleAccordionChange('info')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Name"
                    value={patientData.name || ''}
                    onChange={handleInputChange('name')}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Age"
                    type="number"
                    value={patientData.age || ''}
                    onChange={handleInputChange('age')}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      value={patientData.gender || ''}
                      onChange={handleInputChange('gender')}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Avatar URL"
                    value={patientData.avatarUrl || ''}
                    onChange={handleInputChange('avatarUrl')}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                </AccordionDetails>
              </Accordion>

              {/* Contact Accordion */}
              <Accordion
                expanded={expanded.contact}
                onChange={handleAccordionChange('contact')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Contact</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Phone"
                    value={patientData.phone || ''}
                    onChange={handleInputChange('phone')}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Email"
                    value={patientData.email || ''}
                    onChange={handleInputChange('email')}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Address"
                    value={patientData.address || ''}
                    onChange={handleInputChange('address')}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                </AccordionDetails>
              </Accordion>

              {/* Others Accordion */}
              <Accordion
                expanded={expanded.others}
                onChange={handleAccordionChange('others')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Others</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Labels"
                    value={patientData.labels?.join(', ') || ''}
                    onChange={handleInputChange('labels')}
                    fullWidth
                    margin="normal"
                    size="small"
                    helperText="Separate labels with commas"
                  />
                  <TextField
                    label="Notes"
                    value={patientData.notes || ''}
                    onChange={handleInputChange('notes')}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    size="small"
                  />
                </AccordionDetails>
              </Accordion>

              {/* Save Button */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            </>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">{tabs[activeTab]} content goes here.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default PatientDrawer;
