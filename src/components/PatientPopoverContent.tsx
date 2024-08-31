import React, { useState } from 'react';
import Button from '@mui/material/Button';
import PatientDetailDrawer from './PatientDetailDrawer';
import { Appointment } from '../types/appointmentEvent';

interface PatientPopoverContentProps {
  appointment: Appointment;
}

const PatientPopoverContent: React.FC<PatientPopoverContentProps> = ({ appointment }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="popover-content" style={{ padding: '10px', maxWidth: '300px' }}>
        {/* Patient Info */}
        <div className="patient-info" style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
          <img src={appointment.patientImage} alt="Patient" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
          <div className="info">
            <p style={{ margin: 0, fontWeight: 'bold' }}>{appointment.patientName}</p>
            <div className="pt-contact" style={{ fontSize: '14px', color: '#666' }}>
              <p style={{ margin: 0 }}>
                <span role="img" aria-label="phone">📞</span> {appointment.phone}
              </p>
              <p style={{ margin: 0 }}>
                <span role="img" aria-label="email">✉️</span> {appointment.email}
              </p>
            </div>
          </div>
        </div>

        {/* Treatment and Doctor Info */}
        <div className="treatment-info" style={{ marginBottom: '10px' }}>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Type Treatments: <span style={{ fontWeight: 'normal' }}>{appointment.treatmentType}</span></p>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Doctor: <span style={{ fontWeight: 'normal' }}>{appointment.medicName}</span></p>
        </div>

        {/* Interventions */}
        <div className="interventions">
          <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Runthrough Treatment</p>
          <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', padding: '10px', backgroundColor: '#f9f9f9' }}>
            {appointment.planningSchedule.map((intervention, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: index !== appointment.planningSchedule.length - 1 ? '10px' : 0 }}>
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{intervention.time}</span>
                <p style={{ margin: 0 }}>{intervention.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleOpenDrawer}
          variant="contained"
          color="primary"
          style={{
            marginTop: '15px',
            width: '100%',
            padding: '10px 15px',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          See Patient Details
        </Button>
      </div>

      {/* Drawer Component */}
      <PatientDetailDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        patientData={appointment}
      />
    </>
  );
};

export default PatientPopoverContent;
