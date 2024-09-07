import React from 'react';
import { TextField, Grid, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface StaffInfoStepProps {
    name: string;
    employmentType: string;
    specialist: string;
    phone: string;
    email: string;
    address: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onEmploymentTypeChange: (e: SelectChangeEvent<string>) => void;
    onSpecialistChange: (e: SelectChangeEvent<string>) => void;
    onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StaffInfoStep: React.FC<StaffInfoStepProps> = ({
    name,
    employmentType,
    specialist,
    phone,
    email,
    address,
    onInputChange,
    onEmploymentTypeChange,
    onSpecialistChange,
    onPhotoUpload,
}) => {
    return (
        <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
                <TextField
                    label="Name"
                    name="name"
                    value={name}
                    onChange={onInputChange}
                    fullWidth
                />
            </Grid>

            {/* Employment Type Field */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="employment-type-label">Employment Type</InputLabel>
                    <Select
                        labelId="employment-type-label"
                        value={employmentType}
                        onChange={onEmploymentTypeChange} // Correct event type
                    >
                        <MenuItem value="full-time">Full-Time</MenuItem>
                        <MenuItem value="part-time">Part-Time</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Specialist Field */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="specialist-label">Specialist</InputLabel>
                    <Select
                        labelId="specialist-label"
                        value={specialist}
                        onChange={onSpecialistChange} // Correct event type
                    >
                        <MenuItem value="Orthodontist">Orthodontist</MenuItem>
                        <MenuItem value="Pediatric Dentist">Pediatric Dentist</MenuItem>
                        <MenuItem value="Prosthodontist">Prosthodontist</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Phone Field */}
            <Grid item xs={12}>
                <TextField
                    label="Phone"
                    name="phone"
                    value={phone}
                    onChange={onInputChange}
                    fullWidth
                />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
                <TextField
                    label="Email"
                    name="email"
                    value={email}
                    onChange={onInputChange}
                    fullWidth
                />
            </Grid>

            {/* Address Field */}
            <Grid item xs={12}>
                <TextField
                    label="Address (Optional)"
                    name="address"
                    value={address}
                    onChange={onInputChange}
                    fullWidth
                />
            </Grid>

            {/* Photo Upload Field */}
            <Grid item xs={12}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={onPhotoUpload}
                />
                <label htmlFor="photo-upload">
                    <Button variant="contained" component="span">
                        Upload Photo
                    </Button>
                </label>
            </Grid>
        </Grid>
    );
};

export default StaffInfoStep;
