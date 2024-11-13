import React, { useEffect, useState } from 'react';
import AppointmentHeader from './../components/appointmentsSection/AppointmentHeader';
import WeekNavigator from './../components/appointmentsSection/WeekNavigator';
import WeekView from './../components/appointmentsSection/WeekView';
import AppointmentDrawer from './../components/drawers/appointment/AppointmentDrawer';
import PatientDetailDrawer from './../components/appointmentsSection/PatientDetailDrawer';
import { Appointment } from '../types/appointmentEvent';
import { Box } from '@mui/material';
import { calculateCurrentWeek, isDateInWeek } from '../../shared/utils/calculateCurrentWeek'; // Utility function for week logic
import AppointmentService from '../../shared/services/fetchAppointments';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/services/store';
import { getSubdomain } from '../../shared/utils/getSubdomains';
import { useWebSocket } from '../../shared/services/WebSocketContext';
import { startOfWeek, addWeeks, subWeeks } from 'date-fns';

const Appointments: React.FC = () => {
  const YOUR_MEDIC_ID = useSelector((state: RootState) => state.auth.subaccountUser.name);
  const { appointments, requestAppointments } = useWebSocket();  // No need for setCurrentWeek, handle current week in logic
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [isAddAppointmentDrawerOpen, setIsAddAppointmentDrawerOpen] = useState<boolean>(false);
  const [isAllAppointments, setIsAllAppointments] = useState<boolean>(true);

  const subaccountToken = useSelector((state: RootState) => state.auth.subaccountToken);
  const database = getSubdomain() + '_db';

  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);  // Keep track of the current week locally
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  // Calculate current week

// Handle appointment requests based on current week
useEffect(() => {
  const weekDates = calculateCurrentWeek(selectedDate);

  if (isDateInWeek(selectedDate, currentWeek)) {
    // Use WebSocket to request appointments for the current week
    requestAppointments(isAllAppointments ? undefined : YOUR_MEDIC_ID);
    setFilteredAppointments([]);  // Reset filtered appointments when it's the current week
  } else {
    // Fetch appointments from the server for the selected week
    const startDate = weekDates[0].toISOString().split('T')[0];
    const endDate = weekDates[6].toISOString().split('T')[0];
    const appointmentService = new AppointmentService(subaccountToken as string, database);
    console.log(startDate, endDate)
    
    appointmentService.fetchWeekAppointments(startDate, endDate, isAllAppointments ? undefined : YOUR_MEDIC_ID)
      .then(fetchedAppointments => {
        setFilteredAppointments(fetchedAppointments);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }

  setCurrentWeek(weekDates);  // Update current week based on selected date
}, [selectedDate, isAllAppointments]);  // Remove currentWeek from the dependency array


  

  // Handler for selecting a date from WeekNavigator
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);  // Reset selected appointment
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
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday is the first day
  const previousWeek = subWeeks(startOfCurrentWeek, 1); // Move to the previous week
  setSelectedDate(previousWeek);
};

// Function to move to the next week
const handleNextWeek = () => {
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday is the first day
  const nextWeek = addWeeks(startOfCurrentWeek, 1); // Move to the next week
  setSelectedDate(nextWeek);
};

  // Function to get appointments count for a given date
  const getAppointmentsCount = (date: Date): number => {
    return appointments.filter(
      (appointment) =>
        new Date(appointment.date).toDateString() === date.toDateString()
    ).length;
  };

  const handleAppointmentClick = async (appointment: Appointment) => {
    try {
      if (!subaccountToken || !database) {
        throw new Error('Missing subaccount token or database');
      }

      const appointmentService = new AppointmentService(subaccountToken, database);
      const appointmentDetails = await appointmentService.fetchAppointment(appointment.appointmentId);

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
      appointmentId: string | null, // Null if it's a new appointment
      appointmentData: Appointment // Appointment type
    ): Promise<Appointment> => {
      try {
        // Get subaccountToken from Redux store and database from subdomain
        const subaccountToken = useSelector((state: RootState) => state.auth.subaccountToken);
        const database = getSubdomain() + '_db';
  
        if (!subaccountToken || !database) {
          throw new Error('Missing subaccount token or database');
        }
  
        const appointmentService = new AppointmentService(subaccountToken, database);
  
        let savedAppointment: Appointment;
  
        if (appointmentId) {
          // Editing an existing appointment
          savedAppointment = await appointmentService.editAppointment(appointmentId, appointmentData);
          console.log('Appointment updated:', savedAppointment);
        } else {
          // Creating a new appointment
          savedAppointment = await appointmentService.createAppointment(appointmentData);
          console.log('Appointment created:', savedAppointment);
        }
  
        return savedAppointment; // Return the created/updated appointment
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
        appointments={filteredAppointments.length > 0 ? filteredAppointments : appointments}
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
