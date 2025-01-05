import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';

interface Appointment {
  treatmentName?: string;
  date?: string;
  color?: string;
}

interface AppointmentCellProps {
    previousAppointment?: Appointment | null;
    nextAppointment?: Appointment | null;
  }

const AppointmentCell: React.FC<AppointmentCellProps> = ({ previousAppointment, nextAppointment }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '10px',
      }}
    >
      {/* Previous Appointment */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: previousAppointment?.color || '#ccc',
            borderRadius: '4px',
          }}
        >
          {previousAppointment ? (
            <ArrowBack sx={{ color: '#fff' }} />
          ) : (
            <Typography variant="caption" sx={{ color: '#fff', textAlign: 'center' }}>
              -
            </Typography>
          )}
        </Box>
        {previousAppointment ? (
          <Box sx={{ maxWidth: '120px', wordWrap: 'break-word' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {previousAppointment.treatmentName}
            </Typography>
            <Typography variant="caption">{previousAppointment.date}</Typography>
          </Box>
        ) : (
          <Typography variant="caption" sx={{ color: '#888' }}>
            No previous appointment
          </Typography>
        )}
      </Box>

      {/* Next Appointment */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {nextAppointment ? (
          <Box sx={{ width: '120px', wordWrap: 'break-word', textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {nextAppointment.treatmentName}
            </Typography>
            <Typography variant="caption">{nextAppointment.date}</Typography>
          </Box>
        ) : (
          <Typography variant="caption" sx={{ color: '#888' }}>
            No following appointment
          </Typography>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: nextAppointment?.color || '#ccc',
            borderRadius: '4px',
          }}
        >
          {nextAppointment ? (
            <ArrowForward sx={{ color: '#fff' }} />
          ) : (
            <Typography variant="caption" sx={{ color: '#fff', textAlign: 'center' }}>
              -
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentCell;