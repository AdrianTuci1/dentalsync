import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Link } from '@mui/material';
import { Appointment } from '../../types/appointmentEvent';

interface AppointmentCardProps {
  appointment: Appointment;
  onAppointmentClick: (appointment: Appointment) => void;
  onPatientClick: (appointment: Appointment) => void;
}

// Define status color mapping
const statusColors: Record<string, string> = {
  done: '#4caf50',        // Green for completed appointments
  upcoming: '#1976d2',    // Blue for upcoming appointments
  missed: '#f44336',      // Red for missed appointments
  notpaid: '#ff9800',  // Orange for unpaid appointments
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAppointmentClick,
  onPatientClick,
}) => {
  const {
    status,
    initialTreatment,
    patientUser, // Assuming you will fetch patient name using this ID
    medicUser, // Assuming you will fetch medic name using this ID
    startHour,
    endHour,
  } = appointment;

  // Fetch patient and medic names using their respective IDs if necessary
  const patientName = `${patientUser}`;
  const medicName = `${medicUser}`;


  return (
    <Card
      variant="outlined"
      sx={{
        marginBottom: 1,
        cursor: 'pointer',
        borderTop: `5px solid ${statusColors[status] || '#1976d2'}`, // Default to blue if status not mapped
        '&:hover': {
          backgroundColor: '#e3f2fd',
        },
      }}
      onClick={() => onAppointmentClick(appointment)}
    >
      <CardContent>
        {/* Status */}
        <Typography variant="caption" color="textSecondary" fontWeight="bold">
          {status.toUpperCase()}
        </Typography>

        {/* Treatment */}
        <Typography variant="subtitle1" fontWeight="bold">
          {initialTreatment || 'No Treatment'}
        </Typography>

        {/* Time */}
        <Typography variant="body2" color="textSecondary">
          {startHour} - {endHour}
        </Typography>

        {/* Patient Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 1,
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering AppointmentCard click
            onPatientClick(appointment);
          }}
        >
          <Avatar
            src={`/path-to-patient-images/${patientUser}.png`} // Replace with actual logic for patient image
            alt={patientName}
            sx={{ width: 24, height: 24, marginRight: 1 }}
          />
          <Link
            component="button"
            variant="body2"
            sx={{ textDecoration: 'underline', color: '#1976d2' }}
          >
            {patientName}
          </Link>
        </Box>

        {/* Medic Info */}
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          {medicName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
