import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { DayOff } from '../../types/Medic';


interface DaysOffStepProps {
  daysOff: DayOff[];
  onDaysOffChange: (updatedDaysOff: DayOff[]) => void;
}

const DaysOffStep: React.FC<DaysOffStepProps> = ({ daysOff, onDaysOffChange }) => {
  const [open, setOpen] = useState(false);
  const [dayOffName, setDayOffName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [repeatYearly, setRepeatYearly] = useState(false);

  const handleAddDayOff = () => {
    const newDayOff: DayOff = {
      id: `${Math.random()}`,
      name: dayOffName,
      startDate,
      endDate,
      repeatYearly,
    };
    onDaysOffChange([...daysOff, newDayOff]);

    // Reset form fields
    setDayOffName('');
    setStartDate('');
    setEndDate('');
    setRepeatYearly(false);
    setOpen(false); // Close the dialog after adding
  };

  const handleRemoveDayOff = (id: string) => {
    const updatedDaysOff = daysOff.filter((dayOff) => dayOff.id !== id);
    onDaysOffChange(updatedDaysOff);
  };

  const handleToggleRepeat = (id: string) => {
    const updatedDaysOff = daysOff.map((dayOff) =>
      dayOff.id === id ? { ...dayOff, repeatYearly: !dayOff.repeatYearly } : dayOff
    );
    onDaysOffChange(updatedDaysOff);
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Day Off
      </Button>

      {daysOff.map((dayOff) => (
        <Grid container alignItems="center" spacing={2} key={dayOff.id} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            <Typography variant="subtitle1">{dayOff.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              {dayOff.startDate} - {dayOff.endDate}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              control={<Switch checked={dayOff.repeatYearly} onChange={() => handleToggleRepeat(dayOff.id)} />}
              label="Repeat yearly"
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => handleRemoveDayOff(dayOff.id)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Dialog for Adding a New Day Off */}
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={endDate}
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
