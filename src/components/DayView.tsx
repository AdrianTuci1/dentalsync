import React from 'react';
import { Box, Paper } from '@mui/material';
import { Appointment } from '../types/appointmentEvent';
import SpanningSlotCard from './SpanningSlotCard'; // Import the new component

interface DayViewProps {
  appointments: Appointment[];
  doctors: string[];
  currentDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ appointments, doctors, currentDate }) => {
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // from 9 AM to 6 PM
  const slotWidth = 320; // Width for each slot
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
    <Box sx={{ display: 'flex', flexDirection: 'column', overflowX: 'scroll', backgroundColor: '#f9fafb', width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `60px repeat(${doctors.length}, ${slotWidth}px)`,}}>
        <Box sx={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>
          Time
        </Box>
        {doctors.map((doctor) => (
          <Box key={doctor} sx={{ height: '60px', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
            {doctor}
          </Box>
        ))}
      </Box>

      <Paper sx={{ width:'100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: `60px repeat(${doctors.length}, ${slotWidth}px)`, gridAutoRows: `${slotHeight}px` }}>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <Box sx={{ width: '60px', height: `${slotHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>
                {`${hour}:00`}
              </Box>
              {doctors.map((doctor) => (
                <Box key={`${doctor}-${hour}`} sx={{ position: 'relative', width: `${slotWidth}px`, height: `${slotHeight}px`, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', backgroundColor: '#f9fafb' }}>
                  {schedule[doctor][hour].map((appointment) => (
                    <SpanningSlotCard
                      key={appointment.id}
                      appointment={appointment}
                      slotHeight={slotHeight}
                    />
                  ))}
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default DayView;
