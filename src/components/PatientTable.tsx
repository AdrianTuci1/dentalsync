import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Box,
    Typography,
    useMediaQuery,
} from '@mui/material';
import PatientService from '../services/patientService'; // Adjust path as needed
import { useSelector } from 'react-redux';

interface Patient {
    id: string; // Assuming ID is a string type
    name: string;
    email: string;
    role: string;
    photo: string;
    patientProfile: {
        id: string;
        gender: string;
        age: number;
        paymentsMade: string[];
        labels: string[];
    };
    previousAppointment: Appointment | null;
    nextAppointment: Appointment | null;
}

interface Appointment {
    appointmentId: string;
    date: string;
    time: string;
    treatmentName: string;
}

interface PatientTableProps {
    onPatientClick: (patientId: string) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ onPatientClick }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const isSmallScreen = useMediaQuery('(max-width:800px)');

    const token = useSelector((state: any) => state.auth.subaccountToken);
    const patientService = new PatientService(token, 'demo_db'); // Replace with actual token and db name


    // Fetch patients on component mount
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await patientService.getPatients();
                setPatients(data || []);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
        fetchPatients();
    }, [patientService]);

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                {!isSmallScreen && (
                    <TableHead>
                        <TableRow>
                            {['Patient Name', 'Appointments', 'Payments Made', 'Labels'].map((column, index) => (
                                <TableCell key={index}>{column}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                )}
                <TableBody>
                    {patients.length > 0 ? (
                        patients.map((patient) => {
                            const { previousAppointment, nextAppointment } = patient;
                            return (
                                <TableRow
                                    key={patient.id}
                                    onClick={() => onPatientClick(patient.id)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt={patient.name} src={patient.photo} sx={{ marginRight: 2 }} />
                                            <Box>
                                                <Typography variant="body1">{patient.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {patient.patientProfile.gender} - {patient.patientProfile.age} years old
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    {!isSmallScreen && (
                                        <>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                    {previousAppointment && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                                                            <Box
                                                                sx={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    bgcolor: '#FFEB3B',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    borderRadius: '4px',
                                                                    marginRight: 1,
                                                                }}
                                                            >
                                                                <img src="/angle-double-left.png" alt="Previous" style={{ width: '30px' }} />
                                                            </Box>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {previousAppointment.treatmentName}
                                                                </Typography>
                                                                <Typography variant="caption">{previousAppointment.date}</Typography>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                    {nextAppointment && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    bgcolor: '#03A9F4',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    borderRadius: '4px',
                                                                    marginRight: 1,
                                                                }}
                                                            >
                                                                <img src="/angle-double-right.png" alt="Next" style={{ width: '30px' }} />
                                                            </Box>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {nextAppointment.treatmentName}
                                                                </Typography>
                                                                <Typography variant="caption">{nextAppointment.date}</Typography>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{patient.patientProfile.paymentsMade.join(', ')}</TableCell>
                                            <TableCell>
                                                {patient.patientProfile.labels.map((label, index) => (
                                                    <Box key={index} sx={{ display: 'inline-block', bgcolor: '#e0e0e0', borderRadius: '5px', padding: '2px 8px', marginRight: '4px' }}>
                                                        {label}
                                                    </Box>
                                                ))}
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                No patient data available.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </TableContainer>
    );
};

export default PatientTable;
