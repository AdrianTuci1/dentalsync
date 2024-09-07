import React, { useState } from 'react';
import { Box, Button, Typography, Backdrop } from '@mui/material';

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

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop to close the drawer when clicking outside */}
          <Backdrop open={isOpen} onClick={toggleDrawer} sx={{ zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

          {/* Stack of drawers */}
          <Box sx={{ position: 'relative', zIndex: 1300 }}>
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
              <Box sx={{ padding: '20px' }}>
                <Typography variant="h6">Step 1: Treatment Details</Typography>
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              </Box>
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
                <Box sx={{ padding: '20px' }}>
                  <Typography variant="h6">Step 2: Pricing Details</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handlePrev}>
                      Back
                    </Button>
                    <Button variant="contained" onClick={handleNext}>
                      Next
                    </Button>
                  </Box>
                </Box>
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
                <Box sx={{ padding: '20px' }}>
                  <Typography variant="h6">Step 3: Review & Confirm</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handlePrev}>
                      Back
                    </Button>
                    <Button variant="contained" onClick={toggleDrawer}>
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default AddTreatmentDrawer;
