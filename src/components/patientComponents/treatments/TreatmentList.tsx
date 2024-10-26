import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TreatmentList: React.FC = () => {
  return (
    <div className="treatment-list">
      <div className="clinic-info">
        <p>Location: 123 Main St, City</p>
        <p>Availability: Mon-Fri, 9am - 5pm</p>
      </div>

      <div className="previous-treatment">
        <h3>Previous Treatment</h3>
        <p>Root Canal Treatment - Completed on 2024-10-15</p>
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
      </div>
    </div>
  );
};

export default TreatmentList;
