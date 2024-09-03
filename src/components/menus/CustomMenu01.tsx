import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, Checkbox, ListItemText, FormGroup, FormControlLabel, Typography } from '@mui/material';
import { State } from '../../types/menuType';

interface CustomMenu01Props {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    onDoctorsChange: (selectedDoctors: string[]) => void;
}

const CustomMenu01: React.FC<CustomMenu01Props> = ({ anchorEl, open, onClose, onDoctorsChange }) => {
    const [state, setState] = useState<State>({
        availableDoctors: [
            { name: 'Liz Adam', color: '#d1efe1', checked: false },
            { name: 'Connor Luca', color: '#a1f1f3', checked: false },
            { name: 'Ibram Har', color: '#ac3f2f', checked: false },
            { name: 'Dominic Zima', color: '#ae7f2f', checked: false },
            { name: 'Chris Luke', color: '#ea2f23', checked: false }
        ],
        treatments: [
            { name: 'Dental Cleaning', checked: false },
            { name: 'Root Canal', checked: false },
            { name: 'Tooth Extraction', checked: false },
            { name: 'Bleaching', checked: false },
            { name: 'Scaling', checked: false },
        ],
        patientQueue: [
            { name: 'John Doe', id: 1 },
            { name: 'Jane Smith', id: 2 },
            { name: 'Mike Johnson', id: 3 }
        ]
    });

    useEffect(() => {
        const selectedDoctors = state.availableDoctors
            .filter(doctor => doctor.checked)
            .map(doctor => doctor.name);
        onDoctorsChange(selectedDoctors);
    }, [state.availableDoctors, onDoctorsChange]);

    const handleDoctorChange = (index: number) => {
        const updatedDoctors = [...state.availableDoctors];
        updatedDoctors[index].checked = !updatedDoctors[index].checked;
        setState((prevState) => ({
            ...prevState,
            availableDoctors: updatedDoctors,
        }));
    };

    const handleTreatmentChange = (index: number) => {
        const updatedTreatments = [...state.treatments];
        updatedTreatments[index].checked = !updatedTreatments[index].checked;
        setState((prevState) => ({
            ...prevState,
            treatments: updatedTreatments,
        }));
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    maxHeight: '400px',
                    width: '250px',
                    padding: '10px',
                },
            }}
        >
            <Typography variant="h6" component="div" style={{ padding: '5px 15px' }}>
                Available Doctors
            </Typography>
            {state.availableDoctors.map((doctor, index) => (
                <MenuItem key={index}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={doctor.checked}
                                onChange={() => handleDoctorChange(index)}
                            />
                        }
                        label={
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <span style={{ backgroundColor: doctor.color, width: '15px', height: '15px', borderRadius: '5px' }}></span>
                                {doctor.name}
                            </div>
                        }
                    />
                </MenuItem>
            ))}

            <Typography variant="h6" component="div" style={{ padding: '5px 15px', marginTop: '10px' }}>
                Type Treatment
            </Typography>
            {state.treatments.map((treatment, index) => (
                <MenuItem key={index}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={treatment.checked}
                                onChange={() => handleTreatmentChange(index)}
                            />
                        }
                        label={treatment.name}
                    />
                </MenuItem>
            ))}

            <Typography variant="h6" component="div" style={{ padding: '5px 15px', marginTop: '10px' }}>
                Patient Queue
            </Typography>
            {state.patientQueue.map((patient) => (
                <MenuItem key={patient.id}>
                    <ListItemText primary={patient.name} />
                </MenuItem>
            ))}
        </Menu>
    );
};

export default CustomMenu01;
