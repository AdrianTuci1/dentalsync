import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MedicalData from './checkupSteps/MedicalData';
import TreatmentPlan from './checkupSteps/TreatmentPlan';
import OralCheck from './checkupSteps/OralCheck';
import PlanAgreement from './checkupSteps/PlanAgreement';

interface MedicalCheckupProps {
  onClose: () => void;
}

const steps = ['Medical Data', 'Treatment Plan', 'Oral Check', 'Plan Agreement'];

const MedicalCheckup: React.FC<MedicalCheckupProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <MedicalData />;
      case 1:
        return <TreatmentPlan />;
      case 2:
        return <OralCheck />;
      case 3:
        return <PlanAgreement />;
      default:
        return 'Unknown Step';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <h2 style={{ margin: 0 }}>Medical Checkup</h2>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Scrollable content */}
      <Box
        sx={{
          flexGrow: 1, // Takes up the remaining space
          overflow: 'auto', // Makes the content scrollable
          padding: 2,
          marginTop: 2,
        }}
      >
        {getStepContent(activeStep)}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, marginBottom: 2 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default MedicalCheckup;
