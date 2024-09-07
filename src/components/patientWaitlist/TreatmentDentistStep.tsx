import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent } from 'react';

interface TreatmentDentistStepProps {
    treatment: string;
    dentist: string;
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
    selectedDate: string; // Use string to handle native date input
    selectedStartTime: string; // Use string to handle native time input
    selectedEndTime: string; // Use string to handle native time input
    onDateChange: (date: string) => void; // Handle date change
    onTimeChange: (time: string, type: 'start' | 'end') => void; // Handle time change
    note: string;
    onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TreatmentDentistStep: React.FC<TreatmentDentistStepProps> = ({
    treatment,
    dentist,
    onInputChange,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
    onDateChange,
    onTimeChange,
    note,
    onFileUpload,
}) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 1: Treatment & Dentist
            </Typography>

            {/* Treatment Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="treatment-label">Treatment</InputLabel>
                <Select
                    labelId="treatment-label"
                    id="treatment"
                    value={treatment}
                    label="Treatment"
                    onChange={onInputChange}
                    name="treatment"
                >
                    <MenuItem value="tooth-scaling">Tooth Scaling</MenuItem>
                    <MenuItem value="filling">Filling</MenuItem>
                    <MenuItem value="root-canal">Root Canal</MenuItem>
                </Select>
            </FormControl>

            {/* Dentist Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="dentist-label">Dentist</InputLabel>
                <Select
                    labelId="dentist-label"
                    id="dentist"
                    value={dentist}
                    label="Dentist"
                    onChange={onInputChange}
                    name="dentist"
                >
                    <MenuItem value="drg-putri-larasati">Drg Putri Larasati</MenuItem>
                    <MenuItem value="drg-john-doe">Drg John Doe</MenuItem>
                    <MenuItem value="drg-susan-smith">Drg Susan Smith</MenuItem>
                </Select>
            </FormControl>

            {/* Native Date Input */}
            <TextField
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true, // Makes sure the label shrinks for native input
                }}
            />

            {/* Native Time Inputs */}
            <Box display="flex" justifyContent="space-between" mt={2}>
                <TextField
                    label="Start Time"
                    type="time"
                    value={selectedStartTime}
                    onChange={(e) => onTimeChange(e.target.value, 'start')}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="End Time"
                    type="time"
                    value={selectedEndTime}
                    onChange={(e) => onTimeChange(e.target.value, 'end')}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>

            {/* Quick Note */}
            <TextField
                label="Quick Note (Optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                name="note"
                value={note}
                onChange={onInputChange}
                inputProps={{ maxLength: 200 }}
            />

            {/* File Upload */}
            <Box mt={2}>
                <Typography variant="body1">Attached Files (Optional)</Typography>
                <input type="file" multiple onChange={onFileUpload} />
            </Box>
        </Box>
    );
};

export default TreatmentDentistStep;
