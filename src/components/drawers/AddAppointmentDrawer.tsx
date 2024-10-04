import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  IconButton,
  Switch,
  Typography,
  FormControlLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Case {
  id: string;
  details: string;
  treatment: string;
  units: number;
  involvedTeeth: string;
  prescription: string;
}

interface Appointment {
  appointmentId: string;
  date: string;
  time: string;
  startHour?: string;
  endHour?: string;
  isDone: boolean;
  price: number;
  isPaid: boolean;
  status: 'done' | 'upcoming' | 'missed' | 'notpaid';
  medicUser: string;
  patientUser: string;
  initialTreatment?: string;
}

interface AddAppointmentDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment?: Appointment; // Optional appointment for editing
}

const AddAppointmentDrawer: React.FC<AddAppointmentDrawerProps> = ({
  open,
  onClose,
  onSave,
  appointment, // New prop
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);

  // State for appointment details
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment>(
    appointment || {
      appointmentId: '', // Generate a new ID when saving if this is a new appointment
      date: '',
      time: '',
      isDone: false,
      price: 0,
      isPaid: false,
      status: 'upcoming',
      medicUser: '',
      patientUser: '',
      initialTreatment: '',
    }
  );

  // State for cases (used in the second tab)
  const [cases, setCases] = useState<Case[]>([]);

  // State for accordion expansion
  const [expandedAccordions, setExpandedAccordions] = useState<{ [key: string]: boolean }>({});

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle input changes for appointment details
  const handleInputChange = (field: keyof Appointment, value: any) => {
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Handle adding a new case
  const handleAddCase = () => {
    const newCase: Case = {
      id: Date.now().toString(),
      details: '',
      treatment: '',
      units: 1,
      involvedTeeth: '',
      prescription: '',
    };
    setCases((prevCases) => [...prevCases, newCase]);
  };

  // Handle updating a case
  const handleCaseChange = (caseId: string, field: keyof Case, value: any) => {
    setCases((prevCases) =>
      prevCases.map((c) => (c.id === caseId ? { ...c, [field]: value } : c))
    );
  };

  // Handle removing a case
  const handleRemoveCase = (caseId: string) => {
    setCases((prevCases) => prevCases.filter((c) => c.id !== caseId));
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions((prevState) => ({
      ...prevState,
      [panel]: isExpanded,
    }));
  };

  // Fetch additional case data for the second tab
  const fetchCaseData = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentDetails.appointmentId}/treatments`);
      const data = await response.json();
      setCases(data); // Assuming the data is a list of cases
    } catch (error) {
      console.error('Error fetching case data:', error);
    }
  };

  // Fetch case data when entering the second tab
  useEffect(() => {
    if (activeTab === 1 && appointmentDetails.appointmentId) {
      fetchCaseData();
    }
  }, [activeTab, appointmentDetails.appointmentId]);

  // Reset form when opening the drawer for a new appointment
  useEffect(() => {
    if (appointment) {
      setAppointmentDetails(appointment);
    } else {
      setAppointmentDetails({
        appointmentId: '',
        date: '',
        time: '',
        isDone: false,
        price: 0,
        isPaid: false,
        status: 'upcoming',
        medicUser: '',
        patientUser: '',
        initialTreatment: '',
      });
      setCases([]); // Reset cases for new appointment
    }
  }, [appointment, open]);

  const tabs = ['Details', 'Treatments', 'Price', 'Delete'];

  const handleSave = () => {
    onSave(appointmentDetails);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400 }}>
        {/* Drawer Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {appointment ? 'Edit Appointment' : 'Add Appointment'}
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
        <Box sx={{ p: 2 }}>
          {activeTab === 0 && (
            // Details Tab Content
            <Accordion
              expanded={expandedAccordions['appointmentDetails'] ?? true}
              onChange={handleAccordionChange('appointmentDetails')}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Appointment Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Patient"
                  value={appointmentDetails.patientUser}
                  onChange={(e) => handleInputChange('patientUser', e.target.value)}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Date"
                  type="date"
                  value={appointmentDetails.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  label="Time"
                  type="time"
                  value={appointmentDetails.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={appointmentDetails.isDone}
                      onChange={(e) => handleInputChange('isDone', e.target.checked)}
                    />
                  }
                  label="Done"
                />

                <TextField
                  label="Operating Staff"
                  value={appointmentDetails.medicUser}
                  onChange={(e) => handleInputChange('medicUser', e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </AccordionDetails>
            </Accordion>
          )}

          {activeTab === 1 && (
            // Treatments Tab Content (fetches data from another route)
            <Box>
              <Button variant="contained" onClick={handleAddCase}>
                Insert Case
              </Button>
              {cases.map((caseItem) => (
                <Accordion
                  key={caseItem.id}
                  expanded={expandedAccordions[caseItem.id] ?? false}
                  onChange={handleAccordionChange(caseItem.id)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Case Details</Typography>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCase(caseItem.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      label="Details"
                      value={caseItem.details}
                      onChange={(e) => handleCaseChange(caseItem.id, 'details', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Treatment"
                      value={caseItem.treatment}
                      onChange={(e) => handleCaseChange(caseItem.id, 'treatment', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Units"
                      type="number"
                      value={caseItem.units}
                      onChange={(e) => handleCaseChange(caseItem.id, 'units', parseInt(e.target.value) || 1)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Involved Teeth"
                      value={caseItem.involvedTeeth}
                      onChange={(e) => handleCaseChange(caseItem.id, 'involvedTeeth', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Prescription"
                      value={caseItem.prescription}
                      onChange={(e) => handleCaseChange(caseItem.id, 'prescription', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {activeTab === 2 && (
            // Expenses/Price Tab Content
            <Box>
              <Typography variant="body1">
                Price: ${appointmentDetails.price.toFixed(2)}
              </Typography>

              <TextField
                label="Price"
                type="number"
                value={appointmentDetails.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                fullWidth
                margin="normal"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={appointmentDetails.isPaid}
                    onChange={(e) => handleInputChange('isPaid', e.target.checked)}
                  />
                }
                label="Paid"
              />
            </Box>
          )}

          {activeTab === 3 && appointment && (
            // Delete Tab Content (only show if editing an appointment)
            <Box>
              <Typography variant="body1">
                Are you sure you want to delete this appointment?
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onSave({ ...appointmentDetails})} // Mark as deleted
              >
                Delete Appointment
              </Button>
            </Box>
          )}
        </Box>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!appointmentDetails.date || !appointmentDetails.time}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddAppointmentDrawer;
