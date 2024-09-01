import React from 'react';
import { TableContainer, Paper } from '@mui/material';
import { Appointment } from '../types/appointmentEvent';
import SpanningSlotCard from './SpanningSlotCard'; // Import the new component

interface DayViewProps {
  appointments: Appointment[];
  doctors: string[];
  currentDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ appointments, doctors, currentDate }) => {
  // Define the working hours
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // from 9 AM to 6 PM
  const slotWidth = 220; // Updated width for each slot
  const slotHeight = 170; // Each slot is 170px tall

  // Organize appointments by doctor and time
  const schedule = doctors.reduce((acc, doctor) => {
    acc[doctor] = {};
    hours.forEach(hour => {
      acc[doctor][hour] = appointments.filter(appointment =>
        appointment.medicName === doctor &&
        appointment.date.toDateString() === currentDate.toDateString() &&
        appointment.startHour === hour
      );
    });
    return acc;
  }, {} as Record<string, Record<number, Appointment[]>>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
      {/* The wrapper div ensures the entire table scrolls horizontally */}
      <div style={{ minWidth: 'max-content' }}>
        {/* Time Labels and Medic Names */}
        <TableContainer component={Paper} style={{ maxHeight: '60px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${doctors.length}, ${slotWidth}px)`, position: 'relative' }}>
            <div style={{ width: '60px', height: '60px', borderRight: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', left: 0, top: 0, zIndex: 3, backgroundColor: '#fff' }}>
              Time
            </div>
            {doctors.map((doctor) => (
              <div key={doctor} style={{ height: '60px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2 }}>
                {doctor}
              </div>
            ))}
          </div>
        </TableContainer>

        {/* Scrollable Appointments Grid */}
        <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${doctors.length}, ${slotWidth}px)`, gridAutoRows: `${slotHeight}px` }}>
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div style={{ width: '60px', height: `${slotHeight}px`, borderRight: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 2 }}>
                  {`${hour}:00`}
                </div>
                {doctors.map((doctor) => (
                  <div key={`${doctor}-${hour}`} style={{ position: 'relative', width: `${slotWidth}px`, height: `${slotHeight}px`, borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc' }}>
                    {schedule[doctor][hour].map((appointment) => (
                      <SpanningSlotCard
                        key={appointment.id}
                        appointment={appointment}
                        slotHeight={slotHeight}
                      />
                    ))}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </TableContainer>
      </div>
    </div>
  );
};

export default DayView;
