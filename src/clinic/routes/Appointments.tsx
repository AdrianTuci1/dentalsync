import React, { useEffect, useState } from 'react';
import AppointmentHeader from './../components/appointmentsSection/AppointmentHeader';
import WeekNavigator from './../components/appointmentsSection/WeekNavigator';
import WeekView from './../components/appointmentsSection/WeekView';
import { Appointment } from '../types/appointmentEvent';
import { Box } from '@mui/material';
import { calculateCurrentWeek } from '../../shared/utils/calculateCurrentWeek'; // Utility function for week logic
import AppointmentService from '../../shared/services/fetchAppointments';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/services/store';
import { getSubdomain } from '../../shared/utils/getSubdomains';
import { useWebSocket } from '../../shared/services/WebSocketContext';
import { openDrawer } from '../../shared/services/drawerSlice'; // Redux drawer actions
import { addWeeks, subWeeks, isSameWeek, isSameDay } from 'date-fns';

const Appointments: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.subaccountUser);
  const { appointments = [] } = useWebSocket(); // Ensure appointments is an array
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAllAppointments, setIsAllAppointments] = useState<boolean>(true);

  const subaccountToken = useSelector((state: RootState) => state.auth.subaccountToken);
  const database = getSubdomain() + '_db';

  const dispatch = useDispatch();

  const [currentWeek, setCurrentWeek] = useState<Date[]>([]); // Keep track of the current week locally
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [displayedAppointments, setDisplayedAppointments] = useState<Appointment[]>([]);

  // Fetch appointments for the selected week
  useEffect(() => {
    const fetchAppointments = async () => {
      const weekDates = calculateCurrentWeek(selectedDate);
      setCurrentWeek(weekDates);

      const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });

      if (isCurrentWeek) {
        setFilteredAppointments([]);
      } else {
        const startDate = weekDates[0].toISOString().split('T')[0];
        const endDate = weekDates[6].toISOString().split('T')[0];

        if (subaccountToken && database) {
          const appointmentService = new AppointmentService(subaccountToken, database);

          try {
            const fetchedAppointments = await appointmentService.fetchWeekAppointments(
              startDate,
              endDate
            );

            const appointmentsArray = fetchedAppointments.appointments || [];
            setFilteredAppointments(
              Array.isArray(appointmentsArray) ? appointmentsArray : []
            );
          } catch (error) {
            console.error('Error fetching appointments:', error);
            setFilteredAppointments([]);
          }
        }
      }
    };

    fetchAppointments();
  }, [selectedDate, subaccountToken, database]);

  // Update displayed appointments
  useEffect(() => {
    const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });
    const allAppointments = isCurrentWeek ? appointments : filteredAppointments;

    if (isAllAppointments) {
      setDisplayedAppointments(allAppointments);
    } else {
      const filtered = allAppointments.filter((appointment) => {
        if (appointment.medicUser) {
          return appointment.medicUser === currentUser.name;
        }
        return false;
      });
      setDisplayedAppointments(filtered);
    }
  }, [
    appointments,
    filteredAppointments,
    isAllAppointments,
    currentUser,
    selectedDate,
  ]);

  // Event Handlers
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = () => {
    dispatch(openDrawer({ type: 'Appointment', data: { appointment: null } }));
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const handleToggleAppointments = () => {
    setIsAllAppointments((prev) => !prev);
  };

  const handlePreviousWeek = () => {
    setSelectedDate((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => addWeeks(prev, 1));
  };

  const getAppointmentsCount = (date: Date): number => {
    return displayedAppointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), date)
    ).length;
  };

  const handleAppointmentClick = async (appointment: Appointment) => {
    try {
      if (!subaccountToken || !database) {
        throw new Error('Missing subaccount token or database');
      }

      const appointmentService = new AppointmentService(subaccountToken, database);
      const appointmentDetails = await appointmentService.fetchAppointment(
        appointment.appointmentId
      );

      dispatch(
        openDrawer({ type: 'Appointment', data: { appointment: appointmentDetails } })
      );
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    }
  };

  const handlePatientClick = (appointment: Appointment) => {
    dispatch(openDrawer({ type: 'Patient', data: { patientId: appointment.patientUser } }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppointmentHeader
        onAddAppointment={handleAddAppointment}
        onTodayClick={handleTodayClick}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        isAllAppointments={isAllAppointments}
        onToggleAppointments={handleToggleAppointments}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <WeekNavigator
        currentWeek={currentWeek}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
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
