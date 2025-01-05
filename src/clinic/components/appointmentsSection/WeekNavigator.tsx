import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface WeekNavigatorProps {
  currentWeek: Date[];
  selectedDate: Date; // Retained for context but not used in selection logic
  getAppointmentsCount: (date: Date) => number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentWeek,
  getAppointmentsCount,
  onPreviousWeek,
  onNextWeek,
}) => {
  const isLargeScreen = useMediaQuery('(min-width:800px)');
  const now = new Date(); // Current day reference

  const renderDays = (weekDays: Date[], isCurrentWeek: boolean) => {
    return weekDays.map((day, index) => {
      const dayInitial = format(day, 'EEE').slice(0, 2); // First two letters of the day, e.g., 'TU'
      const formattedDate = format(day, 'dd/MM'); // e.g., '10/09'
      const appointmentsCount = getAppointmentsCount(day);
      const isNow = isSameDay(day, now); // Highlight only the current day (now)

      return (
        <Box
          key={index}
          sx={{
            padding: '1px',
            textAlign: 'center',
            backgroundColor: isNow
              ? '#1976d2' // Highlight current day (now)
              : isCurrentWeek
              ? '#fff' // Current week background
              : '#b0bec5', // Non-current week background
            color: isNow ? '#fff' : '#000', // Text color for current day vs others
            cursor: 'pointer',
            flexGrow: isCurrentWeek ? 1.8 : 1, // Current week slots are larger
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: isNow ? '2px solid #1976d2' : '1px solid #ccc', // Border for now vs others
            '&:hover': {
              backgroundColor: isNow ? '#1565c0' : '#f0f0f0', // Hover effect for all days
            },
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '8px', fontSize: '14px' }}>
            {dayInitial.toUpperCase()}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '12px' }}>
            {formattedDate}
          </Typography>
          <Box
            sx={{
              marginTop: 1,
              width: 25,
              height: 25,
              borderRadius: '50%',
              backgroundColor: appointmentsCount > 0 ? '#f44336' : '#e0e0e0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="white">
              {appointmentsCount}
            </Typography>
          </Box>
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        display: isLargeScreen ? 'flex' : 'none', // Hide for smaller screens
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '0px 0',
        height: '100px',
      }}
    >
      {/* Previous Week */}
      <Box
        onClick={onPreviousWeek}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#b0bec5',
          borderRadius: '8px',
          flexGrow: 1,
          cursor: 'pointer',
          height: '100%',
        }}
      >
        {renderDays(currentWeek.map((day) => subDays(day, 7)), false)}
      </Box>

      {/* Current Week */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 2,
          height: '100%',
        }}
      >
        {renderDays(currentWeek, true)}
      </Box>

      {/* Next Week */}
      <Box
        onClick={onNextWeek}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          flexGrow: 1,
          cursor: 'pointer',
          height: '100%',
        }}
      >
        {renderDays(currentWeek.map((day) => addDays(day, 7)), false)}
      </Box>
    </Box>
  );
};

export default WeekNavigator;