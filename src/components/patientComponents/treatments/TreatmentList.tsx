import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Dialog, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConsultationCard from '../ConsultationCard';
import ConsultationDetailsPage from '../ConsultationDetail';
import AvailabilityCalendar from './AvailabilityComponent';

const busyDates = [
  new Date(2024, 9, 5), // October 5th
  new Date(2024, 9, 10), // October 10th
  new Date(2024, 9, 15), // October 15th
];

// Mock data for appointments
const upcomingAppointment = {
  id: '2',
  medicName: 'Dr. Jane Smith',
  medicImage: '/path/to/image2.jpg', // Replace with actual image path
  treatmentName: 'Root Canal',
  date: '22 Dec 2024',
  time: '10:00 - 11:00',
};

const previousAppointment = {
  id: '1',
  medicName: 'Dr. John Doe',
  medicImage: '/path/to/image1.jpg', // Replace with actual image path
  treatmentName: 'Dental Cleaning',
  date: '20 Dec 2024',
  time: '09:00 - 10:00',
};

const TreatmentList: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const handleCardClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="treatment-list">
      <div className="appointment-section">
        <h3>Upcoming</h3>
        {upcomingAppointment ? (
          <ConsultationCard
            consultation={upcomingAppointment}
            onClick={() => handleCardClick(upcomingAppointment)}
          />
        ) : (
          <p>No upcoming appointment</p>
        )}
      </div>

      <div className="appointment-section">
        <h3>Previous</h3>
        {previousAppointment ? (
          <ConsultationCard
            consultation={previousAppointment}
            onClick={() => handleCardClick(previousAppointment)}
          />
        ) : (
          <p>No previous appointment</p>
        )}
      </div>

      <div className="availability">
        <AvailabilityCalendar busyDates={busyDates} />
      </div>

      <div className="treatment-categories">
        <h3>Treatments by Category</h3>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h4>Preventive Care</h4>
          </AccordionSummary>
          <AccordionDetails>
            <p>Teeth Cleaning, Fluoride Treatment...</p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h4>Restorative Care</h4>
          </AccordionSummary>
          <AccordionDetails>
            <p>Fillings, Crowns, Root Canals...</p>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="image-contain" style={{ display: 'flex', width: '100%', minHeight: '300px', overflow: 'hidden', marginTop: '20px', borderRadius: '10px', marginBottom: '50px' }}>
        <img src="/democlinic.jpg" alt="clinic" style={{ width: '100%', objectFit: 'cover' }} />
      </div>

      {/* Fullscreen Dialog for Appointment Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullScreen>
        {selectedAppointment && (
          <ConsultationDetailsPage consultation={selectedAppointment} onCancel={handleCloseDialog} />
        )}
        <IconButton onClick={handleCloseDialog} style={{ position: 'absolute', top: 10, right: 10 }}>
          <ExpandMoreIcon />
        </IconButton>
      </Dialog>
    </div>
  );
};

export default TreatmentList;
