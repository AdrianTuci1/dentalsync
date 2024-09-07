import React from 'react';
import { Box, Paper } from '@mui/material';
import { Appointment } from '../types/appointmentEvent';
import SpanningSlotCard from './SpanningSlotCard';

interface DayViewProps {
  appointments: Appointment[];
  doctors: string[];
  currentDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ appointments, doctors, currentDate }) => {
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // From 9 AM to 6 PM (10 hours)
  const slotHeight = 150; // Define height for each 1-hour slot

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflowX: 'auto', backgroundColor: '#f9fafb', width: '100%' }}>
      {/* Header Row with Time and Doctor Names */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `60px repeat(${doctors.length}, 300px)`,
          position: 'relative',
        }}
      >
        {/* Time Column Header */}
        <Box
          sx={{
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            fontWeight: 'bold',
            borderRight: '1px solid #e0e0e0',
            position: 'sticky',
            left: 0, // Sticky on the left
            top: 0, // Sticky on the top
            zIndex: 3, // Above other content
          }}
        >
          Time
        </Box>

        {/* Doctor Headers */}
        {doctors.map((doctor) => (
          <Box
            key={doctor}
            sx={{
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              fontWeight: 'bold',
              borderBottom: '1px solid #e0e0e0',
              borderRight: '1px solid #e0e0e0',
              position: 'sticky',
              top: 0, // Sticky only on the top when scrolling vertically
              zIndex: 2, // Above slot content, below time header
            }}
          >
            {doctor}
          </Box>
        ))}
      </Box>

      {/* Schedule Rows */}
      <Paper sx={{ position: 'relative', width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: `60px repeat(${doctors.length}, 300px)`, gridAutoRows: `${slotHeight}px` }}>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time Column */}
              <Box
                sx={{
                  width: '60px',
                  height: `${slotHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  fontWeight: 'bold',
                  borderRight: '1px solid #e0e0e0',
                  position: 'sticky',
                  left: 0, // Sticky on the left
                  zIndex: 20, // Stays above slot content
                }}
              >
                {`${hour}:00`}
              </Box>

              {/* Empty Slots for Each Doctor */}
              {doctors.map((doctor) => (
                <Box
                  key={`${doctor}-${hour}`}
                  sx={{
                    position: 'relative',
                    width: '300px',
                    height: `${slotHeight}px`,
                    borderBottom: '1px solid #e0e0e0',
                    borderRight: '1px solid #e0e0e0',
                    backgroundColor: '#f9fafb',
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </Box>

        {/* Render only the appointment cards that match the currentDate */}
        {appointments
          .filter((appointment) => appointment.date.toDateString() === currentDate.toDateString()) // Filter by the current date
          .map((appointment) => {
            const startSlot = appointment.startHour - 9; // Get the relative starting slot (based on 9 AM start)
            const topPosition = startSlot * slotHeight; // Calculate the top position based on start hour
            const appointmentDurationInMinutes = (appointment.endHour - appointment.startHour) * 60;
            const height = (appointmentDurationInMinutes / 60) * slotHeight; // Calculate height based on duration

            return (
              <SpanningSlotCard
                key={appointment.id}
                appointment={appointment}
                slotHeight={height} // Pass the calculated height based on duration
                topPosition={topPosition} // Position the card absolutely based on the start hour
                doctorIndex={doctors.findIndex((doc) => doc === appointment.medicName)} // Pass the doctor's index for horizontal positioning
              />
            );
          })}
      </Paper>
    </Box>
  );
};

export default DayView;
