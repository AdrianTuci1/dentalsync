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
    IconButton,
    Menu,
    MenuItem,
    Box,
    Typography,
    useMediaQuery,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Patient {
    id: number;
    name: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
    imageUrl: string;
    registered: string;
    lastVisit: string;
    lastTreatment: string;
    previousAppointmentId: number;
    nextAppointmentId: number;
    paymentsMade: string;
    labels: string[];
}

interface Appointment {
    id: number;
    treatment: string;
    date: string;
    treatmentColor: string;
}

interface PatientTableProps {
    onPatientClick: (patient: any) => void;
}

const dummyData: Patient[] = [
    {
        id: 1,
        name: 'Willie Jennie',
        gender: 'Male',
        age: 21,
        phone: '(302) 555-0107',
        email: 'willie.jennings@mail.com',
        imageUrl: 'https://via.placeholder.com/40',
        registered: 'Mar 12, 2021',
        lastVisit: '05 Jun 2021',
        lastTreatment: 'Tooth Scaling + Bleach',
        previousAppointmentId: 101,
        nextAppointmentId: 102,
        paymentsMade: '$300',
        labels: ['VIP', 'Follow-up'],
    },
    {
        id: 2,
        name: 'Michelle Rivera',
        gender: 'Female',
        age: 30,
        phone: '(208) 555-0112',
        email: 'michelle.rivera@mail.com',
        imageUrl: 'https://via.placeholder.com/40',
        registered: 'Mar 12, 2021',
        lastVisit: '03 May 2021',
        lastTreatment: 'Tooth Scaling + Veneers',
        previousAppointmentId: 103,
        nextAppointmentId: 104,
        paymentsMade: '$500',
        labels: ['New Patient'],
    },
];

const fetchAppointment = async (appointmentId: number): Promise<Appointment> => {
    // Replace with actual fetch logic
    const appointments: Appointment[] = [
        { id: 101, treatment: 'Cleaning', date: '17 Aug 2024', treatmentColor: '#FFEB3B' },
        { id: 102, treatment: 'Filling', date: '15 Sep 2024', treatmentColor: '#03A9F4' },
        { id: 103, treatment: 'Scaling', date: '01 Mar 2021', treatmentColor: '#8BC34A' },
        { id: 104, treatment: 'Whitening', date: '12 Oct 2024', treatmentColor: '#F44336' },
    ];
    return appointments.find((appointment) => appointment.id === appointmentId) || appointments[0];
};

const PatientTable: React.FC<PatientTableProps> = ({ onPatientClick }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [appointmentsData, setAppointmentsData] = useState<{ [key: number]: Appointment }>({});
    const isSmallScreen = useMediaQuery('(max-width:800px)');

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, patient: Patient) => {
        setAnchorEl(event.currentTarget);
        setSelectedPatient(patient);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPatient(null);
    };

    useEffect(() => {
        // Fetch appointments for dummy data
        dummyData.forEach(async (patient) => {
            const previousAppointment = await fetchAppointment(patient.previousAppointmentId);
            const nextAppointment = await fetchAppointment(patient.nextAppointmentId);
            setAppointmentsData((prevData) => ({
                ...prevData,
                [patient.previousAppointmentId]: previousAppointment,
                [patient.nextAppointmentId]: nextAppointment,
            }));
        });
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                {!isSmallScreen && (
                    <TableHead>
                        <TableRow>
                            {['Patient Name', 'Appointments', 'Payments Made', 'Labels'].map((column, index) => (
                                <TableCell key={index}>
                                    {column}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                )}
                <TableBody>
                    {dummyData.map((patient) => {
                        const prevApp = appointmentsData[patient.previousAppointmentId];
                        const nextApp = appointmentsData[patient.nextAppointmentId];
                        return (
                            <TableRow key={patient.id} onClick={() => onPatientClick(patient)} sx={{ cursor: 'pointer' }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            aria-label="more"
                                            aria-controls="long-menu"
                                            aria-haspopup="true"
                                            onClick={(event) => handleMenuClick(event, patient)}
                                            sx={{ marginRight: 1 }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Avatar
                                            alt={patient.name}
                                            src={patient.imageUrl}
                                            sx={{ marginRight: 2, display: 'inline-block', verticalAlign: 'middle' }}
                                        />
                                        <Box>
                                            <Typography variant="body1">{patient.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {patient.gender} - {patient.age} years old
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
                                                    flexWrap: 'wrap', // Allow the entire section to wrap
                                                    justifyContent: 'space-between',
                                                    gap: 2, // Add space between previous and next
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {prevApp && (
                                                        <Box
                                                            sx={{
                                                                width: '40px',
                                                                height: '40px',
                                                                bgcolor: prevApp.treatmentColor,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderRadius: '4px',
                                                                marginRight: 1,
                                                            }}
                                                        >
                                                            <img src="/angle-double-left.png" alt="Previous" style={{width:'30px'}}/>
                                                        </Box>
                                                    )}
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                                                        {prevApp && (
                                                            <>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {prevApp.treatment}
                                                                </Typography>
                                                                <Typography variant="caption">{prevApp.date}</Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {nextApp && (
                                                        <Box
                                                            sx={{
                                                                width: '40px',
                                                                height: '40px',
                                                                bgcolor: nextApp.treatmentColor,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderRadius: '4px',
                                                                marginRight: 1,
                                                            }}
                                                        >
                                                            <img src="/angle-double-right.png" alt="Next" style={{width:'30px'}}/>
                                                        </Box>
                                                    )}
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                                                        {nextApp && (
                                                            <>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {nextApp.treatment}
                                                                </Typography>
                                                                <Typography variant="caption">{nextApp.date}</Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{patient.paymentsMade}</TableCell>
                                        <TableCell>
                                            {patient.labels.map((label, index) => (
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
                    })}
                </TableBody>
            </Table>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => console.log('Create Appointment')}>Create Appointment</MenuItem>
                <MenuItem onClick={() => console.log('Edit')}>Edit</MenuItem>
                <MenuItem onClick={() => console.log('Delete')}>Delete</MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default PatientTable;
