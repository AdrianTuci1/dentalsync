import React, { useState } from 'react';
import { Box, Backdrop } from '@mui/material';
import Step1 from './TreatmentStep';
import Step2 from './MultipleVisitStep';
import Step3 from './SetupComponentStep';

interface AddTreatmentDrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const AddTreatmentDrawer: React.FC<AddTreatmentDrawerProps> = ({ isOpen, toggleDrawer }) => {
  const [activeStep, setActiveStep] = useState(0); // State to track the active step

  // Function to move to the next step
  const handleNext = () => {
    if (activeStep < 2) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Function to move to the previous step
  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Function to handle drawer close and reset the steps
  const handleClose = () => {
    setActiveStep(0); // Reset the step to 0
    toggleDrawer(); // Close the drawer
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop to close the drawer when clicking outside */}
          <Backdrop open={isOpen} onClick={handleClose} sx={{ zIndex: 999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

          {/* Stack of drawers */}
          <Box sx={{ position: 'relative', zIndex: 1000 }}>
            {/* Step 1 */}
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                right: activeStep > 0 ? '-300px' : '0px', // Shift Step 1 to the right when inactive (100px visible)
                width: '400px',
                height: '100vh',
                backgroundColor: 'white',
                boxShadow: 3,
                transition: 'right 0.3s ease', // Smooth slide transition
                zIndex: activeStep === 0 ? 1301 : 1200, // Higher z-index for the current active card
              }}
            >
              <Step1 handleNext={handleNext} handleClose={handleClose}/>
            </Box>

            {/* Step 2 */}
            {activeStep >= 1 && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  right: activeStep === 2 ? '-300px' : '150px', // Shift Step 2 to the left when active, with 100px of Step 1 visible
                  width: '400px',
                  height: '100vh',
                  backgroundColor: 'white',
                  boxShadow: 3,
                  transition: 'right 0.3s ease', // Smooth slide transition
                  zIndex: activeStep === 1 ? 1301 : 1200,
                }}
              >
                <Step2 handleClose={handleClose} handlePrev={handlePrev} handleNext={handleNext} />
                </Box>
            )}

            {/* Step 3 */}
            {activeStep >= 2 && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  right: '150px', // Shift Step 3 to the left when active, with 100px of Step 2 visible
                  width: '400px',
                  height: '100vh',
                  backgroundColor: 'white',
                  boxShadow: 3,
                  transition: 'right 0.3s ease', // Smooth slide transition
                  zIndex: 1301, // Top card stays on top
                }}
              >
                <Step3 handleClose={handleClose} handlePrev={handlePrev} />

              </Box>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default AddTreatmentDrawer;
