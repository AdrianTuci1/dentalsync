import React, { useState } from "react";
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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { DayOff } from "@/features/clinic/types/Medic"; // Ensure this type is correctly defined

interface DaysOffStepProps {
  daysOff: DayOff[];
  onDaysOffChange: (updatedDaysOff: DayOff[]) => void;
}

const DaysOffStep: React.FC<DaysOffStepProps> = ({ daysOff, onDaysOffChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dayOffName, setDayOffName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [repeatYearly, setRepeatYearly] = useState<boolean>(false);

  const handleAddDayOff = () => {
    if (!dayOffName || !startDate || !endDate) return; // Prevent adding incomplete entries

    const newDayOff: DayOff = {
      id: `${Date.now()}`, // Generate a unique ID
      name: dayOffName.trim(),
      startDate,
      endDate,
      repeatYearly,
    };

    onDaysOffChange([...daysOff, newDayOff]);

    // Reset form fields
    setDayOffName("");
    setStartDate("");
    setEndDate("");
    setRepeatYearly(false);
    setOpen(false); // Close the dialog after adding
  };

  const handleRemoveDayOff = (id: string) => {
    onDaysOffChange(daysOff.filter((dayOff) => dayOff.id !== id));
  };

  const handleToggleRepeat = (id: string) => {
    onDaysOffChange(
      daysOff.map((dayOff) =>
        dayOff.id === id ? { ...dayOff, repeatYearly: !dayOff.repeatYearly } : dayOff
      )
    );
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Day Off
      </Button>

      {daysOff.length > 0 ? (
        daysOff.map((dayOff) => (
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
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No days off added yet.
        </Typography>
      )}

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
          <Button variant="contained" onClick={handleAddDayOff} disabled={!dayOffName || !startDate || !endDate}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DaysOffStep;