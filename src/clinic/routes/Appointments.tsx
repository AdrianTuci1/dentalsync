import React, { useEffect, useState } from 'react';
import AppointmentHeader from './../components/appointmentsSection/AppointmentHeader';
import WeekNavigator from './../components/appointmentsSection/WeekNavigator';
import WeekView from './../components/appointmentsSection/WeekView';
import { Appointment } from '../types/appointmentEvent';
import { Box } from '@mui/material';
import { calculateCurrentWeek } from '../../shared/utils/calculateCurrentWeek';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/services/store';
import { openDrawer } from '../../shared/services/drawerSlice';
import { addWeeks, subWeeks, isSameWeek, isSameDay } from 'date-fns';
import { useWebSocket } from '../../shared/services/WebSocketContext'; // Use the WebSocket context

// fix the WeekNavigator
// fix the fetchAppointments(ln40) - startDate is off by a day


const Appointments: React.FC = () => {
  const { appointments, fetchAppointments } = useWebSocket();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAllAppointments, setIsAllAppointments] = useState<boolean>(true);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);


  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.subaccountUser);

  useEffect(() => {
    const weekDates = calculateCurrentWeek(selectedDate);
    setCurrentWeek(weekDates);

    const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });

    if (isCurrentWeek) {
      fetchAppointments(); // Fetch current week appointments without parameters
    } else {
      const startDate = weekDates[0].toISOString().split('T')[0];
      const endDate = weekDates[6].toISOString().split('T')[0];
      fetchAppointments({ startDate, endDate }); // Pass startDate and endDate for a different week
    }
  }, [selectedDate, fetchAppointments]);

  const displayedAppointments = Array.isArray(appointments)
  ? appointments.filter((appointment) => {
      if (isAllAppointments) {
        return true;
      }
      return appointment.medicId === currentUser.id; // Filter by current user's medicId if needed
    })
  : []; // Fallback to an empty array if appointments is not an array


  const handlePreviousWeek = () => setSelectedDate((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setSelectedDate((prev) => addWeeks(prev, 1));
  const handleTodayClick = () => setSelectedDate(new Date());

  const handleAddAppointment = () => {
    dispatch(openDrawer({ type: 'Appointment', data: { appointment: null } }));
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    dispatch(openDrawer({ type: 'Appointment', data: { appointment: appointment } }));
  };

  const handlePatientClick = (appointment: Appointment) => {
    dispatch(openDrawer({ type: 'Patient', data: { patientId: appointment.patientId } }));
  };

  const getAppointmentsCount = (date: Date): number => {
    return displayedAppointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), date)
    ).length;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppointmentHeader
        onAddAppointment={handleAddAppointment}
        onTodayClick={handleTodayClick}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        isAllAppointments={isAllAppointments}
        onToggleAppointments={() => setIsAllAppointments((prev) => !prev)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <WeekNavigator
        currentWeek={currentWeek}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        getAppointmentsCount={getAppointmentsCount}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      <WeekView
        selectedWeek={currentWeek}
        appointments={displayedAppointments}
        onAppointmentClick={handleAppointmentClick}
        onPatientClick={handlePatientClick}
      />
    </Box>
  );
};

export default Appointments;
