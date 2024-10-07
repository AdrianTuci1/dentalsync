import React, { useEffect, useState } from 'react';
import AppointmentHeader from '../../components/appointmentsSection/AppointmentHeader';
import WeekNavigator from '../../components/appointmentsSection/WeekNavigator';
import WeekView from '../../components/appointmentsSection/WeekView';
import AppointmentDrawer from '../../components/drawers/appointment/AppointmentDrawer';
import PatientDetailDrawer from '../../components/appointmentsSection/PatientDetailDrawer';
import { Appointment } from '../../types/appointmentEvent';
import { Box } from '@mui/material';
import { calculateCurrentWeek } from '../../utils/calculateCurrentWeek'; // Move current week logic here
import AppointmentService from '../../services/fetchAppointments';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { getSubdomain } from '../../utils/getSubdomains';
import { useWebSocket } from '../../services/WebSocketContext';



const Appointments: React.FC = () => {

  const YOUR_MEDIC_ID = useSelector((state: RootState) => state.auth.subaccountUser.id);
  const { currentWeek ,setCurrentWeek, appointments, requestAppointments } = useWebSocket(); 


  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Drawer states
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [isAddAppointmentDrawerOpen, setIsAddAppointmentDrawerOpen] = useState<boolean>(false);

  // Switch state
  const [isAllAppointments, setIsAllAppointments] = useState<boolean>(true);


    // Fetch subaccountToken and database once in the component
    const subaccountToken = useSelector((state: RootState) => state.auth.subaccountToken);
    const database = getSubdomain() + '_db';


    useEffect(() => {
      // Request appointments based on the current week and toggle state
      requestAppointments(isAllAppointments, isAllAppointments ? undefined : YOUR_MEDIC_ID);
    }, [currentWeek, isAllAppointments]);


  useEffect(() => {
    // Calculate the current week based on selectedDate
    const weekDates = calculateCurrentWeek(selectedDate);
    setCurrentWeek(weekDates);
  }, [selectedDate]);


  // Handler for selecting a date from WeekNavigator
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Handler for adding a new appointment
  const handleAddAppointment = () => {
    setSelectedAppointment(null); // No appointment selected for adding new
    setIsAddAppointmentDrawerOpen(true);
  };

  // Handler for navigating to today
  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  // Handler for toggling appointments switch
  const handleToggleAppointments = () => {
    setIsAllAppointments((prev) => !prev);
  };

  // Handler for previous and next week navigation
  const handlePreviousWeek = () => {
    const previousWeek = new Date(selectedDate);
    previousWeek.setDate(selectedDate.getDate() - 7);
    setSelectedDate(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(selectedDate.getDate() + 7);
    setSelectedDate(nextWeek);
  };

  // Function to get appointments count for a given date
  const getAppointmentsCount = (date: Date): number => {
    return appointments.filter(
      (appointment) =>
        new Date(appointment.date).toDateString() === date.toDateString()
    ).length;
  };

    // Handler for clicking on an appointment card
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

  // Handler for clicking on a patient name
  const handlePatientClick = (appointment: Appointment) => {
    setSelectedPatient(appointment);
  };

  // Handler to close AddAppointmentDrawer
  const closeAddAppointmentDrawer = () => {
    setIsAddAppointmentDrawerOpen(false);
    setSelectedAppointment(null);
  };

  // Handler to save new or updated appointment
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

  // Filter appointments based on switch
  const filteredAppointments = isAllAppointments
    ? appointments
    : appointments.filter((appointment) => appointment.medicUser === YOUR_MEDIC_ID); // Replace YOUR_MEDIC_ID accordingly

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
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

      {/* Week Navigator */}
      <WeekNavigator
        currentWeek={currentWeek}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        getAppointmentsCount={getAppointmentsCount}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      {/* Week View */}
      <WeekView
        selectedWeek={currentWeek}
        appointments={filteredAppointments}
        onAppointmentClick={handleAppointmentClick}
        onPatientClick={handlePatientClick}
      />

      {/* Patient Detail Drawer */}
      <PatientDetailDrawer
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patientData={selectedPatient}
      />
         
      {/* Add Appointment Drawer */}
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
