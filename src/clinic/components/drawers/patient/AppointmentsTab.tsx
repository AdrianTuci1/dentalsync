import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import AppointmentService from '../../../../shared/services/fetchAppointments'; // Assuming the path to the service is correct
import { useSelector } from 'react-redux';

interface Appointment {
  appointmentId: string;
  date: string;
  time: string;
  medicUser: {
    id: string;
    name: string;
  };
  initialTreatment: string | null;
}

interface AppointmentsTabProps {
  patientId: string; // The patientId prop
}

const LIMIT = 20; // Limit of appointments to fetch at a time

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ patientId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0); // Pagination offset
  const [hasMore, setHasMore] = useState<boolean>(true); // Track if more appointments are available to load
  const token = useSelector((state: any) => state.auth.subaccountToken); // Access the token from Redux
  const appointmentService = new AppointmentService(token, 'demo_db'); // Using 'demo_db' as database

  const fetchAppointments = async (loadMore: boolean = false) => {
    setLoading(true);
    try {
      const response = await appointmentService.fetchPatientAppointments(patientId, LIMIT, offset);
      if (response.appointments.length < LIMIT) {
        setHasMore(false); // No more appointments if returned list is less than limit
      }

      setAppointments((prevAppointments) =>
        loadMore ? [...prevAppointments, ...response.appointments] : response.appointments
      );
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + LIMIT);
    fetchAppointments(true); // Fetch older appointments and append them
  };

  return (
    <Box sx={{ p: 2 }}>
      {loading && offset === 0 ? (
        <CircularProgress />
      ) : appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.appointmentId}>
              <Typography variant="body1">
                <strong>Date:</strong> {appointment.date} at {appointment.time}
              </Typography>
              <Typography variant="body2">
                <strong>Treatment:</strong> {appointment.initialTreatment || 'No treatment specified'}
              </Typography>
              <Typography variant="body2">
                <strong>Medic:</strong> {appointment.medicUser.name}
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <Typography>No appointments found for this patient.</Typography>
      )}

      {hasMore && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" color="primary" onClick={handleLoadMore}>
              Load More
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AppointmentsTab;
