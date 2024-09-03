import { useState } from 'react';
import { Drawer, Box, Stepper, Step, StepLabel, Button, Typography, TextField } from '@mui/material';

const steps = ['Basic Information', 'Specialization', 'Contact Details'];

const AddMedicDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, padding: '20px' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6">Enter Basic Information</Typography>
              <TextField label="Name" variant="outlined" fullWidth margin="normal" />
              <TextField label="Email" variant="outlined" fullWidth margin="normal" />
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6">Enter Specialization</Typography>
              <TextField label="Specialty" variant="outlined" fullWidth margin="normal" />
            </Box>
          )}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6">Enter Contact Details</Typography>
              <TextField label="Contact" variant="outlined" fullWidth margin="normal" />
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddMedicDrawer;
