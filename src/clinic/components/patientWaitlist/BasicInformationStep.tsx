import React from 'react';
import { Box, TextField, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';

interface BasicInformationStepProps {
    name: string;
    age: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onGenderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
    name,
    age,
    gender,
    email,
    phone,
    address,
    onInputChange,
    onGenderChange
}) => {
    return (
        <Box>
            {/* Patient Name */}
            <TextField
                label="Patient Name"
                variant="outlined"
                fullWidth
                name="name"
                value={name}
                onChange={onInputChange}
                margin="normal"
            />

            <Grid container spacing={2}>
                {/* Age */}
                <Grid item xs={6}>
                    <TextField
                        label="Age"
                        variant="outlined"
                        fullWidth
                        name="age"
                        value={age}
                        onChange={onInputChange}
                        margin="normal"
                        type="number"
                    />
                </Grid>

                {/* Gender */}
                <Grid item xs={6}>
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup row name="gender" value={gender} onChange={onGenderChange}>
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Email Address */}
            <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                name="email"
                value={email}
                onChange={onInputChange}
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <MailOutlineIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Phone Number */}
            <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                name="phone"
                value={phone}
                onChange={onInputChange}
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PhoneIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Address (Optional) */}
            <TextField
                label="Address (Optional)"
                variant="outlined"
                fullWidth
                name="address"
                value={address}
                onChange={onInputChange}
                margin="normal"
                multiline
                rows={3}
                inputProps={{ maxLength: 200 }}
                helperText={`${address.length} / 200`}
            />
        </Box>
    );
};

export default BasicInformationStep;
