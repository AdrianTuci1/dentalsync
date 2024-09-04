import React from 'react';
import { Appointment } from '../types/appointmentEvent'; // Adjust the import path as needed

interface SlotCardProps {
  appointment: Appointment;
}

const SlotCard: React.FC<SlotCardProps> = ({ appointment }) => {
  const { patientName, patientImage, treatmentType, startHour, endHour, medicColor } = appointment;

  return (
    <div
      className="slot-card"
      style={{
        backgroundColor: medicColor, // Set the background color based on the medic's color
        width: '280px', // Fixed width for the card
        height:'100px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#fff', // Assuming white text looks good on colored backgrounds
        position: 'relative',
        zIndex: '9',
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
