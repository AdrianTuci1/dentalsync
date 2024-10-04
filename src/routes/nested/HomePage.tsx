import React, { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';
import { Appointment } from '../../types/appointmentEvent'; // Adjust import path
import AppointmentCard from '../../components/homeSection/AppointmentCard'; // Adjust import path
import WeekAppointmentCard from '../../components/homeSection/WeekAppointmentCard'; // Adjust import path
import { demoAppointments } from '../../utils/demoAppointments';

const HomePage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments);
  const currentUser = true //AuthService.getCurrentUser().name; // Get the current user name

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch appointments from an API or service
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments'); // Replace with your API endpoint
        const data: Appointment[] = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Filter today's, tomorrow's, and this week's appointments
  const todayAppointments = appointments.filter((appointment) => isToday(parseISO(appointment.date)));
  const tomorrowAppointments = appointments.filter((appointment) => isTomorrow(parseISO(appointment.date)));
  const weekAppointments = appointments.filter((appointment) => isThisWeek(parseISO(appointment.date), { weekStartsOn: 1 })); // Assuming the week starts on Monday

  const groupAppointmentsByDay = (appointments: Appointment[]) => {
    return appointments.reduce((acc, appointment) => {
      const day = format(parseISO(appointment.date), 'EEEE');
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(appointment);
      return acc;
    }, {} as Record<string, Appointment[]>);
  };

  const groupedAppointments = groupAppointmentsByDay(weekAppointments);

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 60px)', overflowY: 'auto', padding: 0, margin: 0 }}>
      {/* Welcome Box */}
      <Box sx={{ width: '100%', backgroundColor: '#f0f0f0', padding: '5px', marginBottom: '1px' }}>
        <Typography variant="h5" align="left" paddingInlineStart="20px" >
          Welcome, {currentUser}!
        </Typography>
      </Box>

      {/* Responsive Layout: Two columns on larger screens, one column on mobile */}
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
            todayAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
          ) : (
            <Typography variant="body2">No appointments for today.</Typography>
          )}

          <Typography variant="h6" sx={{ backgroundColor: '#d0d0d0', padding: '5px', marginTop: '16px', color: '#333' }}>
            Appointments for Tomorrow
          </Typography>
          {tomorrowAppointments.length > 0 ? (
            tomorrowAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
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
            <Box key={day} sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#cccccc', borderBottom:'1px solid #d0d0d0' }}>
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
                    key={appointment.id}
                    doctorName={appointment.medicName}
                    avatar={appointment.medicName.charAt(0)}
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
