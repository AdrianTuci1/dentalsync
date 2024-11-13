import React, { useState } from 'react';
import { Drawer, Stepper, Step, StepLabel, Box, Button, Typography, SelectChangeEvent } from '@mui/material';
import TreatmentDentistStep from '../components/patientWaitlist/TreatmentDentistStep'; // First step
import BasicInformationStep from '../components/patientWaitlist/BasicInformationStep'; // Second step
import OralHygieneHabitsStep from '../components/patientWaitlist/OralHygieneHabitsStep'; // Third step

interface FormValues {
    treatment: string;
    dentist: string;
    date: string;
    startTime: string;
    endTime: string;
    note: string;
    name: string;
    age: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    dentalVisit: string;
    startDentalCare: string;
    washTeeth: string;
    files: File[];
}

const steps = ['Treatment & Dentist', 'Basic Information', 'Oral Hygiene habits'];

const AddPatientDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [activeStep, setActiveStep] = useState(0); // Step control state
    const [formValues, setFormValues] = useState<FormValues>({
        treatment: '',
        dentist: '',
        date: '',
        startTime: '',
        endTime: '',
        note: '',
        name: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        dentalVisit: '',
        startDentalCare: '',
        washTeeth: '',
        files: [],
    });

    // Navigation: Back and Next button handlers
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Input handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, gender: value }));
    };

    const handleDateChange = (date: string) => {
        setFormValues((prevValues) => ({ ...prevValues, date }));
    };

    const handleTimeChange = (time: string, type: 'start' | 'end') => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [type === 'start' ? 'startTime' : 'endTime']: time,
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFormValues((prevValues) => ({
                ...prevValues,
                files: filesArray,
            }));
        }
    };

    // Render content for each step
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <TreatmentDentistStep
                        treatment={formValues.treatment}
                        dentist={formValues.dentist}
                        selectedDate={formValues.date}
                        selectedStartTime={formValues.startTime}
                        selectedEndTime={formValues.endTime}
                        note={formValues.note}
                        onInputChange={handleInputChange}
                        onDateChange={handleDateChange}
                        onTimeChange={handleTimeChange}
                        onFileUpload={handleFileUpload}
                    />
                );
            case 1:
                return (
                    <BasicInformationStep
                        name={formValues.name}
                        age={formValues.age}
                        gender={formValues.gender}
                        email={formValues.email}
                        phone={formValues.phone}
                        address={formValues.address}
                        onInputChange={handleInputChange}
                        onGenderChange={handleGenderChange}
                    />
                );
            case 2:
                return (
                    <OralHygieneHabitsStep
                        dentalVisit={formValues.dentalVisit}
                        startDentalCare={formValues.startDentalCare}
                        washTeeth={formValues.washTeeth}
                        onInputChange={handleInputChange}
                    />
                );
            default:
                return <Typography>Unknown Step</Typography>;
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 400, padding: '20px' }}>
                {/* Stepper at the top */}
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Step content */}
                <Box sx={{ my: 4 }}>
                    {getStepContent(activeStep)}
                </Box>

                {/* Back and Next buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AddPatientDrawer;
