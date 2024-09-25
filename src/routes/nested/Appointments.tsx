// src/components/Appointments.tsx

import React, { useEffect, useState } from 'react';
import AppointmentHeader from '../../components/appointmentsSection/AppointmentHeader';
import WeekNavigator from '../../components/appointmentsSection/WeekNavigator';
import WeekView from '../../components/appointmentsSection/WeekView';
import AppointmentDetailDrawer from '../../components/appointmentsSection/AppointmentDetailDrawer';
import PatientDetailDrawer from '../../components/appointmentsSection/PatientDetailDrawer';
import { Appointment } from '../../types/appointmentEvent';
import { Box } from '@mui/material';
import { demoAppointments } from '../../utils/demoAppointments';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Drawer states
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [isAppointmentDrawerOpen, setIsAppointmentDrawerOpen] = useState<boolean>(false);
  const [isPatientDrawerOpen, setIsPatientDrawerOpen] = useState<boolean>(false);

  // Switch state
  const [isAllAppointments, setIsAllAppointments] = useState<boolean>(true);

  useEffect(() => {
    // Fetch appointments from API
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

  useEffect(() => {
    // Calculate the current week based on selectedDate
    const calculateCurrentWeek = () => {
      const dayOfWeek = selectedDate.getDay(); // 0 (Sun) to 6 (Sat)
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);

      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
      });

      setCurrentWeek(weekDates);
    };

    calculateCurrentWeek();
  }, [selectedDate]);

  // Handler for selecting a date from WeekNavigator
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Handler for adding a new appointment
  const handleAddAppointment = () => {
    // Implement your add appointment logic here
    console.log('Add Appointment Clicked');
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
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDrawerOpen(true);
  };

  // Handler for clicking on a patient name
  const handlePatientClick = (appointment: Appointment) => {
    setSelectedPatient(appointment);
    setIsPatientDrawerOpen(true);
  };

  // Handler to close AppointmentDetailDrawer
  const closeAppointmentDrawer = () => {
    setIsAppointmentDrawerOpen(false);
    setSelectedAppointment(null);
  };

  // Handler to close PatientDetailDrawer
  const closePatientDrawer = () => {
    setIsPatientDrawerOpen(false);
    setSelectedPatient(null);
  };

  // Filter appointments based on switch
  const filteredAppointments = isAllAppointments
    ? appointments
    : appointments.filter((appointment) => appointment.medicId === YOUR_MEDIC_ID); // Replace YOUR_MEDIC_ID accordingly

  return (
    <Box sx={{width:'100%'}}>
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

      {/* Appointment Detail Drawer */}
      <AppointmentDetailDrawer
        open={isAppointmentDrawerOpen}
        onClose={closeAppointmentDrawer}
        appointmentData={selectedAppointment}
      />

      {/* Patient Detail Drawer */}
      <PatientDetailDrawer
        open={isPatientDrawerOpen}
        onClose={closePatientDrawer}
        patientData={selectedPatient}
      />


      {/*Add Appointment Drawer */}
      
    </Box>
  );
};

export default Appointments;
