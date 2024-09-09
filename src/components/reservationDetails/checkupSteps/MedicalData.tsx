import React, { useState } from 'react';
import { Button, Checkbox, FormGroup, FormControlLabel, TextField, Box, Typography } from '@mui/material';

const MedicalData: React.FC = () => {
  // State to handle selected sicknesses and allergies
  const [sicknesses, setSicknesses] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const sicknessOptions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease'];
  const allergyOptions = ['Penicillin', 'Pollen', 'Dust', 'Peanuts'];

  // Handle checkbox change for sicknesses and allergies
  const handleSicknessChange = (sickness: string) => {
    setSicknesses((prev) => 
      prev.includes(sickness) ? prev.filter((item) => item !== sickness) : [...prev, sickness]
    );
  };

  const handleAllergyChange = (allergy: string) => {
    setAllergies((prev) => 
      prev.includes(allergy) ? prev.filter((item) => item !== allergy) : [...prev, allergy]
    );
  };

  return (
    <Box>
      {/* Button to view oral hygiene habits */}
      <Button variant="outlined" color="primary" sx={{ marginBottom: 2 }}>
        View Oral Hygiene Habits
      </Button>

      {/* Information message */}
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Patient & medical data are based on previous check, you can update it according to the latest data.
      </Typography>

      {/* Blood pressure input */}
      <TextField
        label="Blood Pressure"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 3 }}
      />

      {/* Particular sicknesses checkboxes */}
      <Typography variant="h6">Particular Sicknesses</Typography>
      <FormGroup>
        {sicknessOptions.map((sickness) => (
          <FormControlLabel
            key={sickness}
            control={
              <Checkbox
                checked={sicknesses.includes(sickness)}
                onChange={() => handleSicknessChange(sickness)}
              />
            }
            label={sickness}
          />
        ))}
      </FormGroup>

      {/* Allergies checkboxes */}
      <Typography variant="h6" sx={{ marginTop: 3 }}>
        Allergies
      </Typography>
      <FormGroup>
        {allergyOptions.map((allergy) => (
          <FormControlLabel
            key={allergy}
            control={
              <Checkbox
                checked={allergies.includes(allergy)}
                onChange={() => handleAllergyChange(allergy)}
              />
            }
            label={allergy}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default MedicalData;
