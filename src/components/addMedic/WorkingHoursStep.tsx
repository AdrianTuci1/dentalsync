import React from 'react';
import { Box, Grid, FormControlLabel, Switch, TextField, Typography } from '@mui/material';

interface WorkingHoursStepProps {
    workingHours: { [key: string]: { enabled: boolean; startTime: Date | null; endTime: Date | null } };
    onToggleDay: (day: string) => void;
    onTimeChange: (day: string, type: 'start' | 'end', time: Date | null) => void;
}

const WorkingHoursStep: React.FC<WorkingHoursStepProps> = ({ workingHours, onToggleDay, onTimeChange }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, day: string, type: 'start' | 'end') => {
        const timeValue = e.target.value;
        const [hours, minutes] = timeValue.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        onTimeChange(day, type, date);
    };

    return (
        <Box>
            {daysOfWeek.map((day) => (
                <Grid container alignItems="center" spacing={2} key={day} sx={{ mb: 2 }}>
                    {/* Day Switch */}
                    <Grid item xs={3}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={workingHours[day].enabled}
                                    onChange={() => onToggleDay(day)}
                                    size="small" // Use small size switch to save space
                                />
                            }
                            label={day}
                        />
                    </Grid>

                    {/* Time Inputs */}
                    <Grid item xs={9}>
                        {workingHours[day].enabled ? (
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={5}>
                                    <TextField
                                        label="Start Time"
                                        type="time"
                                        value={
                                            workingHours[day].startTime
                                                ? workingHours[day].startTime.toISOString().substring(11, 16)
                                                : ''
                                        }
                                        onChange={(e) => handleTimeChange(e as React.ChangeEvent<HTMLInputElement>, day, 'start')}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            step: 300, // 5 minutes
                                        }}
                                        sx={{
                                            maxWidth: '90px', // Reduce max width for smaller input
                                            '& .MuiInputBase-input': {
                                                padding: '6px 8px', // Reduce padding for a smaller appearance
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '12px', // Smaller label text
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography sx={{ textAlign: 'center', lineHeight: '40px' }}>to</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        label="End Time"
                                        type="time"
                                        value={
                                            workingHours[day].endTime
                                                ? workingHours[day].endTime.toISOString().substring(11, 16)
                                                : ''
                                        }
                                        onChange={(e) => handleTimeChange(e as React.ChangeEvent<HTMLInputElement>, day, 'end')}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            step: 300, // 5 minutes
                                        }}
                                        sx={{
                                            maxWidth: '90px', // Reduce max width for smaller input
                                            '& .MuiInputBase-input': {
                                                padding: '6px 8px', // Reduce padding for a smaller appearance
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '12px', // Smaller label text
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography sx={{ color: 'gray', ml: 2 }}>Not working on this day</Typography>
                        )}
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
};

export default WorkingHoursStep;
