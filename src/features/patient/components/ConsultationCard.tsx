// ConsultationCard.tsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, Avatar, Box, Divider } from '@mui/material';
import { ArrowForward, CalendarToday, AccessTime } from '@mui/icons-material';
import '../styles/ConsultationCard.scss';

interface Consultation {
  id: string;
  medicName: string;
  medicImage: string; // URL to the medic's image
  treatmentName: string;
  date: string;
  time: string;
}

interface ConsultationCardProps {
  consultation: Consultation;
  onClick: (id: string) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ consultation, onClick }) => {
  return (
    <Card className="consultation-card" onClick={() => onClick(consultation.id)}>
      <CardContent className="card-content">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar src={consultation.medicImage} alt={consultation.medicName} />
            <Box ml={2}>
              <Typography variant="subtitle1" className="medic-name">
                {consultation.medicName}
              </Typography>
              <Typography variant="body2" className="treatment-name">
                {consultation.treatmentName}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" className="arrow-icon">
            <ArrowForward />
          </IconButton>
        </Box>

        <Box mt={2} display="flex" alignItems="center" className="appointment-details">
          <Box display="flex" alignItems="center">
            <CalendarToday fontSize="small" className="icon" />
            <Typography variant="body2" className="date">
              {consultation.date}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem className="divider" />
          <Box display="flex" alignItems="center">
            <AccessTime fontSize="small" className="icon" />
            <Typography variant="body2" className="time">
              {consultation.time}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConsultationCard;
