import React, { useState } from 'react';
import { Box, Typography, Grid, Checkbox, Button, IconButton, TextField, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface DayOff {
    id: string;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    repeatYearly: boolean;
}

interface DaysOffStepProps {
    daysOff: DayOff[];
    onAddDayOff: (dayOff: DayOff) => void;
    onRemoveDayOff: (id: string) => void;
    onToggleRepeat: (id: string) => void;
}

const DaysOffStep: React.FC<DaysOffStepProps> = ({ daysOff, onAddDayOff, onRemoveDayOff, onToggleRepeat }) => {
    const [open, setOpen] = useState(false);
    const [dayOffName, setDayOffName] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [repeatYearly, setRepeatYearly] = useState(false);

    const handleAddDayOff = () => {
        const newDayOff = {
            id: `${Math.random()}`,
            name: dayOffName,
            startDate: startDate ? new Date(startDate) : null, // Convert string to Date
            endDate: endDate ? new Date(endDate) : null, // Convert string to Date
            repeatYearly: repeatYearly,
        };
        onAddDayOff(newDayOff);
        setOpen(false); // Close dialog after adding
    };

    return (
        <Box>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Add Day Off
            </Button>

            {daysOff.map((dayOff) => (
                <Grid container alignItems="center" spacing={2} key={dayOff.id}>
                    <Grid item xs={3}>
                        <Checkbox checked />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>{dayOff.name}</Typography>
                        <Typography variant="body2">
                            {dayOff.startDate ? dayOff.startDate.toLocaleDateString() : 'No start date'} -{' '}
                            {dayOff.endDate ? dayOff.endDate.toLocaleDateString() : 'No end date'}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={<Switch checked={dayOff.repeatYearly} onChange={() => onToggleRepeat(dayOff.id)} />}
                            label="Repeat yearly"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton onClick={() => onRemoveDayOff(dayOff.id)}>
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Day Off</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Day Off Name"
                        fullWidth
                        margin="normal"
                        value={dayOffName}
                        onChange={(e) => setDayOffName(e.target.value)}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={startDate || ''}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={endDate || ''}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Switch checked={repeatYearly} onChange={() => setRepeatYearly(!repeatYearly)} />}
                        label="Repeat yearly"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddDayOff}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DaysOffStep;
