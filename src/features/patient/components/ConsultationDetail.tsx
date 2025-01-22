import React from 'react';
import { Typography, Box, Button, Avatar } from '@mui/material';
import '../styles/consultationDetailsPage.scss';

interface Consultation {
  id: string;
  medicName: string;
  medicImage: string;
  treatmentName: string;
  date: string;
  time: string;
  status?: string;
}

interface ConsultationDetailsPageProps {
  consultation: Consultation;
  onCancel: () => void;
}

const ConsultationDetailsPage: React.FC<ConsultationDetailsPageProps> = ({ consultation, onCancel }) => {
  return (
    <div className="consultation-details-page">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">My Appointment</Typography>
        <Button onClick={onCancel} color="secondary">Cancel</Button>
      </Box>

      <Box display="flex" alignItems="center" mt={2} mb={2}>
        <Avatar src={consultation.medicImage} alt={consultation.medicName} className="medic-image" />
        <Box ml={2}>
          <Typography variant="h6">{consultation.medicName}</Typography>
          <Typography variant="body2">{consultation.treatmentName}</Typography>
          <Typography variant="body2" color="textSecondary">Location: New York, United States</Typography>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>Scheduled Appointment</Typography>
      <Box mb={2}>
        <Typography variant="body2">Date: {consultation.date}</Typography>
        <Typography variant="body2">Time: {consultation.time}</Typography>
        <Typography variant="body2">Medic Contact: (555) 123-4567</Typography>
      </Box>

      <Typography variant="h6" gutterBottom>Patient Info</Typography>
      <Box mb={2}>
        <Typography variant="body2">Full Name: Esther Howard</Typography>
        <Typography variant="body2">Gender: Male</Typography>
        <Typography variant="body2">Age: 27</Typography>
        <Typography variant="body2">Problem: Lorem ipsum dolor</Typography>
      </Box>

      <Button variant="contained" color="secondary" onClick={onCancel} fullWidth>
        Cancel Appointment
      </Button>
    </div>
  );
};

export default ConsultationDetailsPage;
