import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Link } from '@mui/material';
import { Appointment } from '../../types/appointmentEvent';
import generateInitials from '../../../shared/utils/generateInitials'; // Import the generateInitials function


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
  notpaid: '#ff9800',     // Orange for unpaid appointments
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAppointmentClick,
  onPatientClick,
}) => {
  const {
    status,
    initialTreatment,
    patientUser,
    medicUser,
    startHour,
    endHour,
    color, // Assuming treatment color is provided in the appointment data
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

        <div style={{height:'2px', backgroundColor:'lightgray', width:'100%', marginBottom:'3px'}}></div>

        {/* Treatment Name with Initials */}
        <Box display="flex" alignItems="center" marginBottom={1}>
          <Box
            minWidth={30}
            minHeight={30}
            bgcolor={color} // Apply treatment color
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginRight={1}
            style={{ borderRadius: '4px' }}
          >
            <Typography variant="body2" color="white">
              {generateInitials(initialTreatment as string)}
            </Typography>
          </Box>
          <Box
          display="flex"
          height={45}
          alignItems="center"
          justifyContent="center"
          >
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.1}>
            {initialTreatment || 'No Treatment'}
          </Typography>
          </Box>
        </Box>

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
            src={`/patient.png`} // Replace with actual logic for patient image
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 1,
          }}>
        <Avatar
            src={`/medics-sm.png`} // Replace with actual logic for patient image
            alt={patientName}
            sx={{ width: 25, height: 25, marginRight: 1, borderRadius:0 }}
          />
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 0 }}>
          {medicName}
        </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
