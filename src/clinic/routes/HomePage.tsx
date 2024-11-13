import React, { useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import AppointmentCard from './../components/homeSection/AppointmentCard';
import WeekAppointmentCard from './../components/homeSection/WeekAppointmentCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/services/store';
import { useWebSocket } from '../../shared/services/WebSocketContext';
import { Appointment } from '../types/appointmentEvent';

const HomePage: React.FC = () => {
  const { appointments, requestAppointments } = useWebSocket(); // Use WebSocket for fetching appointments
  const currentUser = useSelector((state: RootState) => state.auth.subaccountUser.name);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch appointments for the current week using WebSocket when the component mounts
  useEffect(() => {
    requestAppointments(); // Fetch appointments for the current week
  }, []); // Only run once on mount

  // Helper functions to filter appointments by today, tomorrow, and this week
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateString);
    return date.toDateString() === tomorrow.toDateString();
  };

  // Filtering the appointments
  const todayAppointments = appointments.filter((appointment) => isToday(appointment.date));
  const tomorrowAppointments = appointments.filter((appointment) => isTomorrow(appointment.date));

  // Grouping weekly appointments by day
  const groupAppointmentsByDay = (appointments: Appointment[]) => {
    return appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(appointment);
      return acc;
    }, {} as Record<string, Appointment[]>);
  };

  // Group appointments for the week
  const groupedAppointments = groupAppointmentsByDay(appointments);

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 60px)', overflowY: 'auto', padding: 0, margin: 0 }}>
      <Box sx={{ width: '100%', backgroundColor: '#f0f0f0', padding: '5px', marginBottom: '1px' }}>
        <Typography variant="h5" align="left" paddingInlineStart="20px">
          Welcome, {currentUser}!
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: '100%',
          gap: '1px', // 1px gap for window margins
        }}
      >
        {/* First Column - Appointments for Today and Tomorrow */}
        <Box
          sx={{
            flex: '1 1 60%',
            backgroundColor: '#f8f8f8',
            padding: '5px',
            width: '100%',
            marginRight: '1px',
            border: '1px solid #d0d0d0',
          }}
        >
          <Typography variant="h6" sx={{ backgroundColor: '#d0d0d0', padding: '5px', color: '#333' }}>
            Appointments for Today
          </Typography>
          {todayAppointments.length > 0 ? (
            todayAppointments.map((appointment) => (
              <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
            ))
          ) : (
            <Typography variant="body2">No appointments for today.</Typography>
          )}

          <Typography variant="h6" sx={{ backgroundColor: '#d0d0d0', padding: '5px', marginTop: '16px', color: '#333' }}>
            Appointments for Tomorrow
          </Typography>
          {tomorrowAppointments.length > 0 ? (
            tomorrowAppointments.map((appointment) => (
              <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
            ))
          ) : (
            <Typography variant="body2">No appointments for tomorrow.</Typography>
          )}
        </Box>

        {/* Second Column - Appointments for This Week */}
        <Box
          sx={{
            flex: '1 1 40%',
            backgroundColor: '#f8f8f8',
            padding: '5px',
            width: '100%',
            border: '1px solid #d0d0d0',
          }}
        >
          <Typography variant="h6" sx={{ backgroundColor: '#d0d0d0', padding: '5px', color: '#333' }}>
            Appointments for This Week
          </Typography>
          {Object.keys(groupedAppointments).map((day) => (
            <Box key={day} sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#cccccc', borderBottom: '1px solid #d0d0d0' }}>
              <Typography
                sx={{
                  width: '30%',
                  padding: '5px',
                  textAlign: 'center',
                  borderRight: '1px solid #bdbdbd',
                }}
              >
                {day}
              </Typography>
              <Box sx={{ width: '70%' }}>
                {groupedAppointments[day].map((appointment) => (
                  <WeekAppointmentCard
                    key={appointment.appointmentId}
                    doctorName={appointment.medicUser}
                    avatar={appointment.medicUser.charAt(0)}
                    appointmentCount={groupedAppointments[day].length}
                    day={day}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
