import React from 'react';
import { Box, FormControlLabel, Switch, TextField, Typography } from '@mui/material';

interface WorkingHoursStepProps {
  workingHours: { [key: string]: string };
  onTimeChange: (day: string, hours: string) => void;
}

const WorkingHoursStep: React.FC<WorkingHoursStepProps> = ({ workingHours, onTimeChange }) => {
  const daysOfWeek = [
    { label: 'Monday', key: 'Mon' },
    { label: 'Tuesday', key: 'Tue' },
    { label: 'Wednesday', key: 'Wed' },
    { label: 'Thursday', key: 'Thu' },
    { label: 'Friday', key: 'Fri' },
    { label: 'Saturday', key: 'Sat' },
    { label: 'Sunday', key: 'Sun' }
  ];

  const parseTimeRange = (timeRange: string) => {
    const [start, end] = timeRange.split('-').map((time) => time.trim());
    return { startTime: start, endTime: end };
  };

  const formatTimeRange = (start: string, end: string) => `${start}-${end}`;

  const handleToggleDay = (dayKey: string) => {
    if (workingHours[dayKey]) {
      // Day is currently enabled, so disable it by removing it from workingHours
      onTimeChange(dayKey, ''); // Send empty string to remove from parent
    } else {
      // Day is currently disabled, so enable it with default hours
      onTimeChange(dayKey, '9:00-17:00');
    }
  };

  const handleTimeChange = (dayKey: string, type: 'start' | 'end', timeValue: string) => {
    const currentRange = parseTimeRange(workingHours[dayKey] || '9:00-17:00');
    const newRange = type === 'start'
      ? formatTimeRange(timeValue, currentRange.endTime)
      : formatTimeRange(currentRange.startTime, timeValue);

    onTimeChange(dayKey, newRange);
  };

  return (
    <Box>
      {daysOfWeek.map(({ label, key }) => {
        const isEnabled = !!workingHours[key];
        const { startTime, endTime } = isEnabled ? parseTimeRange(workingHours[key]) : { startTime: '', endTime: '' };

        return (
          <Box key={key} sx={{ mb: 2 }}>
            {/* Day Switch */}
            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={() => handleToggleDay(key)}
                  size="small"
                />
              }
              label={label}
            />
            {/* Time Inputs */}
            {isEnabled ? (
              <Box display="flex" alignItems="center" ml={4} mt={1}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 minutes
                  sx={{
                    width: '90px',
                    mr: 2,
                    '& .MuiInputBase-input': {
                      padding: '6px 8px',
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '12px',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ lineHeight: '40px', mr: 2 }}>to</Typography>
                <TextField
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 minutes
                  sx={{
                    width: '90px',
                    '& .MuiInputBase-input': {
                      padding: '6px 8px',
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '12px',
                    },
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" ml={4}>
                Not working on this day
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default WorkingHoursStep;
