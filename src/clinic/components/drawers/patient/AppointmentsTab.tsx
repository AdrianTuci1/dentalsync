import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Button, Typography } from "@mui/material";
import AppointmentService from "../../../../shared/services/fetchAppointments"; // Assuming the path to the service is correct
import { useSelector } from "react-redux";
import SmallAppointmentCard from "../../SmallAppointmentCard";

interface Appointment {
  appointmentId: string;
  date: string;
  time: string;
  medicUser: {
    id: string;
    name: string;
  };
  initialTreatment: string | null;
  color: string; // Color received from the API response
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
  const appointmentService = new AppointmentService(token, "demo_db"); // Using 'demo_db' as database

  const fetchAppointments = async (loadMore: boolean = false) => {
    setLoading(true);
    try {
      const response = await appointmentService.fetchPatientAppointments(
        patientId,
        LIMIT,
        offset
      );
      if (response.appointments.length < LIMIT) {
        setHasMore(false); // No more appointments if returned list is less than limit
      }

      setAppointments((prevAppointments) =>
        loadMore ? [...prevAppointments, ...response.appointments] : response.appointments
      );
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
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
        <Box>
          {appointments.map((appointment) => (
            <SmallAppointmentCard
              key={appointment.appointmentId}
              role="patient" // Assuming the role is "patient" for this tab
              data={{
                date: appointment.date,
                time: appointment.time,
                initialTreatment: appointment.initialTreatment || "No Treatment",
                medicUser: appointment.medicUser.name,
                patientUser: "N/A", // For this tab, patient details are not displayed
                color: appointment.color, // Use color from the API response
              }}
            />
          ))}
        </Box>
      ) : (
        <Typography>No appointments found for this patient.</Typography>
      )}

      {hasMore && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
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
