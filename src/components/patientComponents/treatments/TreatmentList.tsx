import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Dialog, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConsultationCard from '../ConsultationCard';
import ConsultationDetailsPage from '../ConsultationDetail';
import AvailabilityCalendar from './AvailabilityComponent';

const busyDates = [
  new Date(2024, 10, 5),  // November 5, 2024
  new Date(2024, 10, 12), // November 12, 2024
  new Date(2024, 10, 19), // November 19, 2024
  new Date(2024, 10, 26), // November 26, 2024
];

const moderateDates = [
  new Date(2024, 10, 6),  // November 6, 2024
  new Date(2024, 10, 13), // November 13, 2024
  new Date(2024, 10, 20), // November 20, 2024
  new Date(2024, 10, 27), // November 27, 2024
];

const normalDates = [
  new Date(2024, 10, 7),  // November 7, 2024
  new Date(2024, 10, 14), // November 14, 2024
  new Date(2024, 10, 21), // November 21, 2024
  new Date(2024, 10, 28), // November 28, 2024
];

const nonWorkingDays = [
  new Date(2024, 10, 2),  // November 2, 2024 (Saturday)
  new Date(2024, 10, 3),  // November 3, 2024 (Sunday)
  new Date(2024, 10, 9),  // November 9, 2024 (Saturday)
  new Date(2024, 10, 10), // November 10, 2024 (Sunday)
  new Date(2024, 10, 16), // November 16, 2024 (Saturday)
  new Date(2024, 10, 17), // November 17, 2024 (Sunday)
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
        <AvailabilityCalendar
          busyDates={busyDates}
          moderateDates={moderateDates}
          normalDates={normalDates}
          nonWorkingDays={nonWorkingDays}
        />
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
