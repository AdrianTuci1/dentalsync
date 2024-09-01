import React from 'react';
import { Appointment } from '../types/appointmentEvent';

interface SpanningSlotCardProps {
  appointment: Appointment;
  slotHeight: number;
}

const SpanningSlotCard: React.FC<SpanningSlotCardProps> = ({ appointment, slotHeight }) => {
  const duration = appointment.endHour - appointment.startHour;
  const height = duration * slotHeight;

  return (
    <div
      style={{
        backgroundColor: '#1976d2',
        color: '#fff',
        padding: '10px',
        borderRadius: '4px',
        textAlign: 'center',
        width: '100%',
        height: `${height}px`, // Span the appropriate number of slots
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <strong>{appointment.patientName}</strong><br />
      {appointment.reason}
    </div>
  );
};

export default SpanningSlotCard;
