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
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 2 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {previousAppointment.treatmentName}
                                                                </Typography>
                                                                <Typography variant="caption">{previousAppointment.date}</Typography>
                                                            </Box>
                                                        )}
                                                        {nextAppointment && (
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {nextAppointment.treatmentName}
                                                                </Typography>
                                                                <Typography variant="caption">{nextAppointment.date}</Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{patient.patientProfile.paymentsMade.join(', ')}</TableCell>
                                                <TableCell>
                                                    {patient.patientProfile.labels.map((label, index) => (
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
