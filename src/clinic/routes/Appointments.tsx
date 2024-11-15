import React, { useEffect, useState } from 'react';
import AppointmentHeader from './../components/appointmentsSection/AppointmentHeader';
import WeekNavigator from './../components/appointmentsSection/WeekNavigator';
import WeekView from './../components/appointmentsSection/WeekView';
import AppointmentDrawer from './../components/drawers/appointment/AppointmentDrawer';
import PatientDetailDrawer from './../components/appointmentsSection/PatientDetailDrawer';
import { Appointment } from '../types/appointmentEvent';
import { Box } from '@mui/material';
import { calculateCurrentWeek } from '../../shared/utils/calculateCurrentWeek'; // Utility function for week logic
import AppointmentService from '../../shared/services/fetchAppointments';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/services/store';
import { getSubdomain } from '../../shared/utils/getSubdomains';
import { useWebSocket } from '../../shared/services/WebSocketContext';
import { addWeeks, subWeeks, isSameWeek, isSameDay } from 'date-fns';

const Appointments: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.subaccountUser);
  const { appointments = [] } = useWebSocket(); // Ensure appointments is an array
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [isAddAppointmentDrawerOpen, setIsAddAppointmentDrawerOpen] = useState<boolean>(false);
  const [isAllAppointments, setIsAllAppointments] = useState<boolean>(true);

  const subaccountToken = useSelector((state: RootState) => state.auth.subaccountToken);
  const database = getSubdomain() + '_db';

  const [currentWeek, setCurrentWeek] = useState<Date[]>([]); // Keep track of the current week locally
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [displayedAppointments, setDisplayedAppointments] = useState<Appointment[]>([]);

  // Function to determine if the selected week is the current week
  const isSelectedWeekCurrentWeek = (selectedDate: Date): boolean => {
    const today = new Date();
    return isSameWeek(selectedDate, today, { weekStartsOn: 1 });
  };

  // Handle appointment requests based on selected week
  useEffect(() => {
    const fetchAppointments = async () => {
      const weekDates = calculateCurrentWeek(selectedDate);
      setCurrentWeek(weekDates);

      const isCurrentWeek = isSelectedWeekCurrentWeek(selectedDate);

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

            // Extract the appointments array from the fetched data
            const appointmentsArray = fetchedAppointments.appointments || [];

            setFilteredAppointments(
              Array.isArray(appointmentsArray) ? appointmentsArray : []
            );
          } catch (error) {
            console.error('Error fetching appointments:', error);
            setFilteredAppointments([]); // Set to empty array on error
          }
        } else {
          console.error('Missing subaccount token or database');
          setFilteredAppointments([]); // Set to empty array if missing tokens
        }
      }
    };

    fetchAppointments();
  }, [selectedDate, subaccountToken, database]);


  useEffect(() => {
    const isCurrentWeek = isSelectedWeekCurrentWeek(selectedDate);
    const allAppointments = isCurrentWeek ? appointments : filteredAppointments;

   // console.log('--- Updating displayedAppointments ---');
   // console.log('Selected Date:', selectedDate);
   // console.log('Is Current Week:', isCurrentWeek);
   // console.log('Appointments from WebSocket:', appointments);
   // console.log('Filtered Appointments from Server:', filteredAppointments);
   // console.log('All Appointments Used:', allAppointments);

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


  // Handler for selecting a date from WeekNavigator
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null); // Reset selected appointment
    setIsAddAppointmentDrawerOpen(true);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  const handleToggleAppointments = () => {
    setIsAllAppointments((prev) => !prev);
  };

  // Function to move to the previous week
  const handlePreviousWeek = () => {
    const previousWeek = subWeeks(selectedDate, 1);
    setSelectedDate(previousWeek);
  };

  // Function to move to the next week
  const handleNextWeek = () => {
    const nextWeek = addWeeks(selectedDate, 1);
    setSelectedDate(nextWeek);
  };

  // Function to get appointments count for a given date
  const getAppointmentsCount = (date: Date): number => {
    if (!Array.isArray(displayedAppointments)) {
      console.error('displayedAppointments is not an array');
      return 0;
    }
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

      setSelectedAppointment(appointmentDetails);
      setIsAddAppointmentDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    }
  };

  const handlePatientClick = (appointment: Appointment) => {
    setSelectedPatient(appointment);
  };

  const closeAddAppointmentDrawer = () => {
    setIsAddAppointmentDrawerOpen(false);
    setSelectedAppointment(null);
  };

  // Handle saving an appointment (create or update)
  const handleSaveAppointment = async (
    appointmentId: string | null,
    appointmentData: Appointment
  ): Promise<Appointment> => {
    try {
      if (!subaccountToken || !database) {
        throw new Error('Missing subaccount token or database');
      }

      const appointmentService = new AppointmentService(subaccountToken, database);

      let savedAppointment: Appointment;

      if (appointmentId) {
        savedAppointment = await appointmentService.editAppointment(
          appointmentId,
          appointmentData
        );
        console.log('Appointment updated:', savedAppointment);
      } else {
        savedAppointment = await appointmentService.createAppointment(appointmentData);
        console.log('Appointment created:', savedAppointment);
      }

      return savedAppointment;
    } catch (error) {
      console.error('Error saving appointment:', error);
      throw error;
    }
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

      <PatientDetailDrawer
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patientData={selectedPatient}
      />

      <AppointmentDrawer
        open={isAddAppointmentDrawerOpen}
        onClose={closeAddAppointmentDrawer}
        onSave={handleSaveAppointment}
        appointment={selectedAppointment || undefined}
      />
    </Box>
  );
};

export default Appointments;
