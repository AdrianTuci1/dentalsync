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
import { ArrowBack, ArrowForward } from '@mui/icons-material';

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

                                                    <Box
                                                        sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                        padding: '10px',
                                                        }}
                                                    >
                                                        {/* Previous Appointment */}
                                                        <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                        }}
                                                        >
                                                        <Box
                                                            sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: previousAppointment?.color || '#ccc',
                                                            borderRadius: '4px',
                                                            }}
                                                        >
                                                            {previousAppointment ? (
                                                            <ArrowBack sx={{ color: '#fff' }} />
                                                            ) : (
                                                            <Typography variant="caption" sx={{ color: '#fff', textAlign: 'center' }}>
                                                                -
                                                            </Typography>
                                                            )}
                                                        </Box>
                                                        {previousAppointment ? (
                                                            <Box sx={{ maxWidth: '120px', wordWrap: 'break-word' }}> {/* Limit width and allow wrapping */}
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                {previousAppointment.treatmentName}
                                                            </Typography>
                                                            <Typography variant="caption">{previousAppointment.date}</Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" sx={{ color: '#888' }}>
                                                            No previous appointment
                                                            </Typography>
                                                        )}
                                                        </Box>

                                                        {/* Next Appointment */}
                                                        <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                        }}
                                                        >
                                                        {nextAppointment ? (
                                                            <Box sx={{ width: '120px', wordWrap: 'break-word', textAlign:'right' }}> {/* Limit width and allow wrapping */}
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                {nextAppointment.treatmentName}
                                                            </Typography>
                                                            <Typography variant="caption">{nextAppointment.date}</Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" sx={{ color: '#888' }}>
                                                            No following appointment
                                                            </Typography>
                                                        )}
                                                        <Box
                                                            sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: nextAppointment?.color || '#ccc',
                                                            borderRadius: '4px',
                                                            }}
                                                        >
                                                            {nextAppointment ? (
                                                            <ArrowForward sx={{ color: '#fff' }} />
                                                            ) : (
                                                            <Typography variant="caption" sx={{ color: '#fff', textAlign: 'center' }}>
                                                                -
                                                            </Typography>
                                                            )}
                                                        </Box>
                                                        </Box>
                                                    </Box>

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