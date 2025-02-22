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
import { addWeeks, subWeeks, isSameWeek, isSameDay, format } from 'date-fns';
import { useWebSocket } from '../../shared/services/WebSocketContext'; // Use the WebSocket context


const Appointments: React.FC = () => {
  const { appointments, fetchAppointments } = useWebSocket();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAllAppointments, setIsAllAppointments] = useState<boolean>(true);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);


  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.subaccountUser);

  useEffect(() => {
  
    // Calculate the current week
    const weekDates = calculateCurrentWeek(selectedDate);
  
    setCurrentWeek(weekDates);
  
    // Check if the selected week is the current week
    const now = new Date();
    const isCurrentWeek = isSameWeek(selectedDate, now, { weekStartsOn: 1 });
  
    if (isCurrentWeek) {
      fetchAppointments(); // Fetch appointments for the current week
    } else {
      const startDate = format(weekDates[0], 'yyyy-MM-dd'); // Format in local time
      const endDate = format(weekDates[6], 'yyyy-MM-dd');

      fetchAppointments({ startDate, endDate }); // Fetch appointments for other weeks
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
