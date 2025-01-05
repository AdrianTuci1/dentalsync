import React from 'react';
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
    Button,
    useMediaQuery,
} from '@mui/material';
import AppointmentCell from './AppointmentCell';

interface Patient {
    id: string;
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
    color?: string;
}

interface PatientTableProps {
    patients: Patient[];
    onPatientClick: (patientId: string) => void;
    onLoadMore: () => void;
    isLoading: boolean;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, onPatientClick, onLoadMore, isLoading }) => {
    const isSmallScreen = useMediaQuery('(max-width:800px)');

    return (
        <Box>
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
                                                <Avatar
                                                    alt={patient.name}
                                                    src={patient.photo || '/default-avatar.png'}
                                                    sx={{ marginRight: 2 }}
                                                />
                                                <Box>
                                                    <Typography variant="body1">{patient.name}</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {patient?.patientProfile?.gender || 'Unknown'} - {patient?.patientProfile?.age || 'N/A'} years old
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        {!isSmallScreen && (
                                            <>
                                                <TableCell>
                                                <AppointmentCell
                                                    previousAppointment={previousAppointment}
                                                    nextAppointment={nextAppointment}
                                                />

                                                </TableCell>
                                                <TableCell>{patient?.patientProfile?.paymentsMade?.join(', ') || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {patient?.patientProfile?.labels?.map((label, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                display: 'inline-block',
                                                                bgcolor: '#e0e0e0',
                                                                borderRadius: '5px',
                                                                padding: '2px 8px',
                                                                marginRight: '4px',
                                                            }}
                                                        >
                                                            {label}
                                                        </Box>
                                                    )) || 'N/A'}
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

            {/* Load More Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onLoadMore}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Load More'}
                </Button>
            </Box>
        </Box>
    );
};

export default PatientTable;