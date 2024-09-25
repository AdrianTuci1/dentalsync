// src/components/AddAppointmentModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Appointment } from '../../types/appointmentEvent';
import { DatePicker, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

interface AddAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (appointment: Omit<Appointment, 'id'>) => void;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [treatment, setTreatment] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [medicName, setMedicName] = useState<string>('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<Appointment['status']>('upcoming');
  const [price, setPrice] = useState<number>(0);
  const [details, setDetails] = useState<string>('');
  const [color, setColor] = useState<string>('#1976d2');

  const handleSubmit = () => {
    if (!date || !startTime || !endTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const newAppointment: Omit<Appointment, 'id'> = {
      date: date.toISOString().split('T')[0],
      startHour: startTime.toTimeString().split(' ')[0],
      endHour: endTime.toTimeString().split(' ')[0],
      medicId: YOUR_MEDIC_ID, // Replace with actual medic ID
      medicName,
      patientId: Math.floor(Math.random() * 1000), // Replace with actual patient ID
      patientName,
      patientImage: '/default-patient.png', // Replace with actual image if available
      details,
      treatment,
      price,
      paid: false,
      status,
      color,
    };

    onAdd(newAppointment);
    // Reset form
    setTreatment('');
    setPatientName('');
    setMedicName('');
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setStatus('upcoming');
    setPrice(0);
    setDetails('');
    setColor('#1976d2');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-appointment-title">
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '80%', sm: '400px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Typography id="add-appointment-title" variant="h6" component="h2" gutterBottom>
          Add New Appointment
        </Typography>
        <Divider />

        {/* Form Fields */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Treatment"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            required
          />
          <TextField
            label="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
          <TextField
            label="Medic Name"
            value={medicName}
            onChange={(e) => setMedicName(e.target.value)}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              renderInput={(params) => <TextField {...params} required />}
            />
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} required />}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} required />}
            />
          </LocalizationProvider>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Appointment['status'])}
            required
          >
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="done">Done</MenuItem>
            <MenuItem value="not done">Not Done</MenuItem>
            <MenuItem value="not paid">Not Paid</MenuItem>
            <MenuItem value="missed">Missed</MenuItem>
          </TextField>
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
          <TextField
            label="Details"
            multiline
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>Color:</Typography>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', padding: 0 }}
            />
          </Box>
          <Button variant="contained" onClick={handleSubmit}>
            Add Appointment
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddAppointmentModal;
