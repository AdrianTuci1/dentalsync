import React from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';

interface WorkingHoursStepProps {
  workingHours: { [key: string]: string };
  onWorkingHoursChange: (day: string, hours: string) => void;
}

const WorkingHoursStep: React.FC<WorkingHoursStepProps> = ({ workingHours, onWorkingHoursChange }) => {
  const daysOfWeek = [
    { label: 'Monday', key: 'Mon' },
    { label: 'Tuesday', key: 'Tue' },
    { label: 'Wednesday', key: 'Wed' },
    { label: 'Thursday', key: 'Thu' },
    { label: 'Friday', key: 'Fri' },
    { label: 'Saturday', key: 'Sat' },
    { label: 'Sunday', key: 'Sun' },
  ];

  const parseTimeRange = (timeRange: string) => {
    const [start, end] = timeRange.split('-').map((time) => time.trim());
    return { startTime: start, endTime: end };
  };

  const formatTimeRange = (start: string, end: string) => `${start}-${end}`;

  const handleToggleDay = (dayKey: string) => {
    if (workingHours[dayKey]) {
      onWorkingHoursChange(dayKey, ''); // Disable the day
    } else {
      onWorkingHoursChange(dayKey, '09:00-17:00'); // Enable with default hours
    }
  };

  const handleTimeChange = (dayKey: string, type: 'start' | 'end', timeValue: string) => {
    const currentRange = parseTimeRange(workingHours[dayKey] || '09:00-17:00');
    const newRange =
      type === 'start'
        ? formatTimeRange(timeValue, currentRange.endTime)
        : formatTimeRange(currentRange.startTime, timeValue);

    onWorkingHoursChange(dayKey, newRange);
  };

  return (
    <Box>
      {daysOfWeek.map(({ label, key }) => {
        const isEnabled = !!workingHours[key];
        const { startTime, endTime } = isEnabled
          ? parseTimeRange(workingHours[key])
          : { startTime: '', endTime: '' };

        return (
          <Box key={key} sx={{ mb: 2 }}>
            {/* Day Toggle */}
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
                <label style={{ marginRight: '8px' }}>
                  Start Time:
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                    style={{
                      marginLeft: '8px',
                      marginRight: '16px',
                      padding: '4px',
                      width: '100px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                </label>
                <label>
                  End Time:
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                    style={{
                      marginLeft: '8px',
                      padding: '4px',
                      width: '100px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                </label>
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