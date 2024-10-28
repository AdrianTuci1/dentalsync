import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationMap from './LocationMap';
import AppointmentCard from '../AppointmentCard';
import AvailabilityCalendar from './AvailabilityComponent';

const position: [number, number] = [40.7128, -74.0060]; //

const busyDates = [
  new Date(2024, 9, 5), // October 5th
  new Date(2024, 9, 10), // October 10th
  new Date(2024, 9, 15), // October 15th
];

const TreatmentList: React.FC = () => {


  return (
    <div className="treatment-list">
      <div className="clinic-info">
      </div>

      <div className="previous-treatment">
        <h3>Previous Treatment</h3>
        <AppointmentCard
          treatmentName="Teeth Whitening"
          medicUser="Dr. John Doe"
          date="2024-10-28"
          details="This is a teeth whitening procedure. The patient is advised to avoid coffee for 48 hours."
          recommendations="Use sensitive toothpaste for a week post-treatment."
        />
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
        {/* Add more accordions for other treatment categories */}

        <div className="image-contain" style={{display:'flex', width:'100%', minHeight:'300px', overflow:'hidden', marginTop:'20px', borderRadius:'10px', padding:'20px'}}>
        <img src='/democlinic.jpg' alt='clinic' style={{width:'100%', objectFit:'cover'}}/>
        </div>
      </div>
    </div>
  );
};

export default TreatmentList;
