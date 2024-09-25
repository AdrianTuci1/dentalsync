// AppointmentHeader.tsx
import React from 'react';
import {
  Box,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TodayIcon from '@mui/icons-material/Today';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomDatePicker from './CustomDatePicker';

interface AppointmentHeaderProps {
  onAddAppointment: () => void;
  onTodayClick: () => void;
  isAllAppointments: boolean;
  onToggleAppointments: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  onAddAppointment,
  onTodayClick,
  isAllAppointments,
  onToggleAppointments,
  selectedDate,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
}) => {
  // Use media query to check if screen width is less than 850px
  const isLargeScreen = useMediaQuery('(min-width:850px)');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 1,
        backgroundColor: '#f5f5f5',
        flexWrap: 'wrap',
      }}
    >
      {/* Left Side: Week Navigation, Date Picker, and Today Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {/* Week Navigation Buttons */}
        <IconButton onClick={onPreviousWeek}>
          <ChevronLeftIcon />
        </IconButton>

        {/* Custom Date Picker */}
        <CustomDatePicker selectedDate={selectedDate} onSelectDate={onSelectDate} />

        <IconButton onClick={onNextWeek}>
          <ChevronRightIcon />
        </IconButton>

        {/* Today Icon (hidden on small screens) */}
        {isLargeScreen && (
          <IconButton onClick={onTodayClick} aria-label="Today">
            <TodayIcon />
          </IconButton>
        )}
      </Box>

      {/* Right Side: Switch and Add New Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          marginTop: { xs: 0, sm: 0 },
        }}
      >
        {/* FormControlLabel (hidden on small screens) */}
        {isLargeScreen && (
          <FormControlLabel
            control={
              <Switch
                checked={isAllAppointments}
                onChange={onToggleAppointments}
                color="primary"
              />
            }
            label={isAllAppointments ? 'All Appointments' : 'My Appointments'}
          />
        )}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddAppointment}
          sx={{ marginLeft: 2 }}
        >
          Add New
        </Button>
      </Box>
    </Box>
  );
};

export default AppointmentHeader;
