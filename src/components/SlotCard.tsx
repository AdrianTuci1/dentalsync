import React from 'react';
import { Appointment } from '../types/appointmentEvent'; // Adjust the import path as needed

interface SlotCardProps {
  appointment: Appointment;
}

const SlotCard: React.FC<SlotCardProps> = ({ appointment }) => {
  const { patientName, patientImage, treatmentType, startHour, endHour } = appointment;

  return (
    <div
      className="slot-card"
      style={{
        maxWidth: '140px',
        height: '120px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="first-row" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <img src={patientImage} alt={patientName} style={{ minWidth: '25px', height: '25px', borderRadius: '50%' }} />
        <h4 style={{ margin: 0 }}>{patientName}</h4>
      </div>
      <p style={{ fontSize: '14px', margin: '5px 0' }}>{treatmentType}</p>
      <p style={{ fontSize: '10px', margin: 0 }}>{`${formatHour(startHour)} - ${formatHour(endHour)}`}</p>
    </div>
  );
};

function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
  return `${hourFormatted}:00 ${period}`;
}

export default SlotCard;

