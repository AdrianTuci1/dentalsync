import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface WeekNavigatorProps {
  currentWeek: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  getAppointmentsCount: (date: Date) => number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentWeek,
  selectedDate,
  onSelectDate,
  getAppointmentsCount,
  onPreviousWeek,
  onNextWeek,
}) => {
  // Generate previous and next week dates based on currentWeek
  const previousWeek = currentWeek.map((day) => subDays(day, 7));
  const nextWeek = currentWeek.map((day) => addDays(day, 7));

  // Responsive design for larger screens
  const isLargeScreen = useMediaQuery('(min-width:800px)');

  // Helper function to render each week's day items
  const renderDays = (weekDays: Date[], isCurrentWeek: boolean) => {
    return weekDays.map((day, index) => {
      const dayInitial = format(day, 'EEE').slice(0, 2); // First two letters of the day, e.g., 'TU'
      const formattedDate = format(day, 'dd/MM'); // e.g., '10/09'
      const appointmentsCount = getAppointmentsCount(day);
      const isSelected = isSameDay(day, selectedDate);

      return (
        <Box
          key={index}
          onClick={() => onSelectDate(day)} // Allow selecting any day
          sx={{
            padding: '1px',
            textAlign: 'center',
            backgroundColor: isSelected
              ? '#1976d2' // Selected day background (blue color)
              : isCurrentWeek
              ? '#fff' // Current week background
              : '#b0bec5', // Non-current week background
            color: isSelected
              ? '#fff' // Selected day text color
              : '#000', // Other days text color
            cursor: 'pointer', // Days are clickable
            flexGrow: isCurrentWeek ? 1.8 : 1, // Current week slots are larger
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: isSelected
              ? '2px solid #1976d2' // Selected day border
              : '1px solid #ccc', // Other days border
            '&:hover': {
              backgroundColor: isSelected ? '#1565c0' : '#f0f0f0', // Hover effect
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
        display: isLargeScreen ? 'flex' : 'none', // Hide when window is less than 800px
        justifyContent: 'space-between',
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
          backgroundColor: '#b0bec5', // Darker background for previous week
          borderRadius: '8px',
          flexGrow: 1, // Auto-adjust width
          cursor: 'pointer',
        }}
      >
        {renderDays(previousWeek, false)}
      </Box>

      {/* Current Week */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 2, // Larger flex for current week
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
          backgroundColor: '#e0e0e0', // Darker background for next week
          borderRadius: '8px',
          flexGrow: 1, // Auto-adjust width
          cursor: 'pointer',
        }}
      >
        {renderDays(nextWeek, false)}
      </Box>
    </Box>
  );
};

export default WeekNavigator;
