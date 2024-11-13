import React from 'react';
import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';

interface OralHygieneHabitsStepProps {
    dentalVisit: string;
    startDentalCare: string;
    washTeeth: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OralHygieneHabitsStep: React.FC<OralHygieneHabitsStepProps> = ({
    dentalVisit,
    startDentalCare,
    washTeeth,
    onInputChange
}) => {
    return (
        <Box>
            {/* Optional Info Message */}
            <Alert severity="info" sx={{ mb: 2 }}>
                Oral Hygiene Habits it's optional, you can do it later.
            </Alert>

            {/* Question 1: When did you make the latest dental visit? */}
            <FormControl component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend">1. When did you make the latest dental visit?</FormLabel>
                <RadioGroup
                    name="dentalVisit"
                    value={dentalVisit}
                    onChange={onInputChange}
                    row
                >
                    <FormControlLabel value="less than 3 months ago" control={<Radio />} label="Less than 3 months ago" />
                    <FormControlLabel value="1 year ago" control={<Radio />} label="1 year ago" />
                    <FormControlLabel value="i don't remember" control={<Radio />} label="I don't remember" />
                </RadioGroup>
            </FormControl>

            {/* Question 2: What time did you start dental care? */}
            <FormControl component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend">2. What time did you start dental care?</FormLabel>
                <RadioGroup
                    name="startDentalCare"
                    value={startDentalCare}
                    onChange={onInputChange}
                    row
                >
                    <FormControlLabel value="teenager" control={<Radio />} label="Teenager" />
                    <FormControlLabel value="about 20 years old" control={<Radio />} label="About 20 years old" />
                    <FormControlLabel value="about 30 years old" control={<Radio />} label="About 30 years old" />
                    <FormControlLabel value="after 30 years old" control={<Radio />} label="After 30 years old" />
                </RadioGroup>
            </FormControl>

            {/* Question 3: How many times, in a day, do you wash your teeth? */}
            <FormControl component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend">3. How many times, in a day, do you wash your teeth?</FormLabel>
                <RadioGroup
                    name="washTeeth"
                    value={washTeeth}
                    onChange={onInputChange}
                    row
                >
                    <FormControlLabel value="never" control={<Radio />} label="Never" />
                    <FormControlLabel value="once" control={<Radio />} label="Once" />
                    <FormControlLabel value="twice" control={<Radio />} label="Twice" />
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default OralHygieneHabitsStep;
