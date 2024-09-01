import React, { useState, useEffect } from 'react';
import '../../styles/components/custommenu.scss';
import { State } from '../../types/menuType';

interface CustomMenu01Props {
    onDoctorsChange: (selectedDoctors: string[]) => void;
}

const CustomMenu01: React.FC<CustomMenu01Props> = ({ onDoctorsChange }) => {
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
        <div className='custom-menu'>
            {/* Available Doctors Section */}
            <div className="doctors-av">
                <h3>AVAILABLE DOCTORS</h3>
                <div className="doctors-list">
                    {state.availableDoctors.map((doctor, index) => (
                        <div key={index} className="doctor-item" style={{display:'flex', gap:'5px', alignItems:'center'}}>
                            <input
                                type="checkbox"
                                id={`doctor-${index}`}
                                checked={doctor.checked}
                                onChange={() => handleDoctorChange(index)}
                                style={{width:'15px', height:'15px'}}
                            />
                            <label htmlFor={`doctor-${index}`} style={{display:'flex', gap:'5px', alignItems:'center'}}>
                                <div className="identifier" style={{ backgroundColor: doctor.color, width:'15px', height:'15px', borderRadius:'5px' }}></div>
                                <p>{doctor.name}</p>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Type Treatment Section */}
            <div className="type-treatment">
                <h3>TYPE TREATMENT</h3>
                <div className="treatment-type">
                    {state.treatments.map((treatment, index) => (
                        <div key={index} className="treatment-item">
                            <input
                                type="checkbox"
                                id={`treatment-${index}`}
                                checked={treatment.checked}
                                onChange={() => handleTreatmentChange(index)}
                            />
                            <label htmlFor={`treatment-${index}`}>
                                {treatment.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Patient Queue Section */}
            <div className="patient-queue">
                <h3>PATIENT QUEUE</h3>
                <div className="queue-list">
                    {state.patientQueue.map((patient) => (
                        <div key={patient.id} className="patient-item">
                            {patient.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomMenu01;
