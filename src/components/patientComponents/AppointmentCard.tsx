import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../../styles/patientDashboard/appointmentCard.scss';

interface AppointmentCardProps {
  treatmentName: string;
  medicUser: string;
  date: string;
  details: string;
  recommendations: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  treatmentName,
  medicUser,
  date,
  details,
  recommendations,
}) => {
  return (
    <div className="appointment-card">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="appointment-header">
            <Typography variant="h6" className="treatment-name">
              {treatmentName}
            </Typography>
            <Typography variant="body2" className="medic-user">
              Medic: {medicUser}
            </Typography>
            <Typography variant="body2" className="appointment-date">
              Date: {date}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" className="appointment-details">
            <strong>Details:</strong> {details}
          </Typography>
          <Typography variant="body2" className="appointment-recommendations">
            <strong>Recommendations:</strong> {recommendations}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AppointmentCard;
