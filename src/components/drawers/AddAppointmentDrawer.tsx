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
  id: string;
  date: string;
  time: string;
  done: boolean;
  operatingStaff: string;
  cases: Case[];
  price: number;
  expenses: number;
  profit: number;
  paid: boolean;
  // Add other fields as necessary
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
      id: '', // Generate a new ID when saving if this is a new appointment
      date: '',
      time: '',
      done: false,
      operatingStaff: '',
      cases: [],
      price: 0,
      expenses: 0,
      profit: 0,
      paid: false,
    }
  );

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
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      cases: [...prevDetails.cases, newCase],
    }));
  };

  // Handle updating a case
  const handleCaseChange = (caseId: string, field: keyof Case, value: any) => {
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      cases: prevDetails.cases.map((c) =>
        c.id === caseId ? { ...c, [field]: value } : c
      ),
    }));
  };

  // Handle removing a case
  const handleRemoveCase = (caseId: string) => {
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      cases: prevDetails.cases.filter((c) => c.id !== caseId),
    }));
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedAccordions((prevState) => ({
      ...prevState,
      [panel]: isExpanded,
    }));
  };

  // Calculate expenses and profit
  const calculateExpensesAndProfit = () => {
    // Placeholder calculations
    const expenses = appointmentDetails.cases.reduce((total, caseItem) => {
      return total + caseItem.units * 10; // Assume $10 expense per unit
    }, 0);

    const profit = appointmentDetails.price - expenses;

    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      expenses,
      profit,
    }));
  };

  // Recalculate expenses and profit whenever cases or price change
  useEffect(() => {
    calculateExpensesAndProfit();
  }, [appointmentDetails.cases, appointmentDetails.price]);

  // Reset form when opening the drawer for a new appointment
  useEffect(() => {
    if (appointment) {
      setAppointmentDetails(appointment);
    } else {
      setAppointmentDetails({
        id: '',
        date: '',
        time: '',
        done: false,
        operatingStaff: '',
        cases: [],
        price: 0,
        expenses: 0,
        profit: 0,
        paid: false,
      });
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
                {/* Operating Staff */}
                <TextField
                  label="Patient"
                  value={appointmentDetails.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  fullWidth
                  margin="normal"
                />

                {/* Date */}
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
                {/* Time */}
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
                {/* Done/Not Done */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={appointmentDetails.done}
                      onChange={(e) => handleInputChange('done', e.target.checked)}
                    />
                  }
                  label="Done"
                />
                {/* Operating Staff */}
                <TextField
                  label="Operating Staff"
                  value={appointmentDetails.operatingStaff}
                  onChange={(e) => handleInputChange('operatingStaff', e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </AccordionDetails>
            </Accordion>
          )}

          {activeTab === 1 && (
            // Treatments Tab Content
            <Box>
              <Button variant="contained" onClick={handleAddCase}>
                Insert Case
              </Button>
              {appointmentDetails.cases.map((caseItem) => (
                <Accordion
                  key={caseItem.id}
                  expanded={expandedAccordions[caseItem.id] ?? false}
                  onChange={handleAccordionChange(caseItem.id)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${caseItem.id}-content`}
                    id={`${caseItem.id}-header`}
                  >
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
                    {/* Details */}
                    <TextField
                      label="Details"
                      value={caseItem.details}
                      onChange={(e) => handleCaseChange(caseItem.id, 'details', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    {/* Treatment */}
                    <TextField
                      label="Treatment"
                      value={caseItem.treatment}
                      onChange={(e) => handleCaseChange(caseItem.id, 'treatment', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    {/* Units */}
                    <TextField
                      label="Units"
                      type="number"
                      value={caseItem.units}
                      onChange={(e) =>
                        handleCaseChange(caseItem.id, 'units', parseInt(e.target.value) || 1)
                      }
                      fullWidth
                      margin="normal"
                    />
                    {/* Involved Teeth */}
                    <TextField
                      label="Involved Teeth"
                      value={caseItem.involvedTeeth}
                      onChange={(e) => handleCaseChange(caseItem.id, 'involvedTeeth', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    {/* Prescription */}
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
              {/* Display Expenses */}
              <Typography variant="body1">
                Expenses: ${appointmentDetails.expenses.toFixed(2)}
              </Typography>
              {/* Display Profit */}
              <Typography variant="body1">
                Profit: ${appointmentDetails.profit.toFixed(2)}
              </Typography>
              {/* Input for Price */}
              <TextField
                label="Price"
                type="number"
                value={appointmentDetails.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                fullWidth
                margin="normal"
              />
              {/* Paid/Not Paid Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={appointmentDetails.paid}
                    onChange={(e) => handleInputChange('paid', e.target.checked)}
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
                onClick={() => onSave({ ...appointmentDetails, deleted: true })} // Mark as deleted
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
