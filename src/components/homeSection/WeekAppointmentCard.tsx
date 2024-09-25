import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';

interface WeekAppointmentCardProps {
  doctorName: string;
  avatar: string;
  appointmentCount: number;
  day: string;
}

const WeekAppointmentCard: React.FC<WeekAppointmentCardProps> = ({ doctorName, avatar, appointmentCount, day }) => {
  return (
    <Paper
      sx={{
        padding: '5px',
        borderRadius: 0,
        width: '100%',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection:'row', width: '100%' }}>
        <Box sx={{maxWidth:'40px'}}>
          <Avatar sx={{ marginRight: '8px'}}>{avatar}</Avatar>
        </Box>
        <Box sx={{ display: 'flex', flexDirection:'column', marginLeft:'8px' }}>
          <Typography variant="subtitle2">{doctorName}</Typography>
          <Typography variant="body2" style={{fontSize:'12px'}}>{appointmentCount} appointments for {day}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WeekAppointmentCard;
