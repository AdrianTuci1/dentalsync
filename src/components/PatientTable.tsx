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
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Patient {
    id: number;
    name: string;
    phone: string;
    email: string;
    imageUrl: string;
    registered: string;
    lastVisit: string;
    lastTreatment: string;
}

const dummyData: Patient[] = [
    { id: 1, name: 'Willie Jennie', phone: '(302) 555-0107', email: 'willie.jennings@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 12, 2021', lastVisit: '05 Jun 2021', lastTreatment: 'Tooth Scaling + Bleach' },
    { id: 2, name: 'Michelle Rivera', phone: '(208) 555-0112', email: 'michelle.rivera@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 12, 2021', lastVisit: '03 May 2021', lastTreatment: 'Tooth Scaling + Veneers' },
    { id: 3, name: 'Tim Jennings', phone: '(225) 555-0118', email: 'tim.jennings@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 10, 2021', lastVisit: '17 Oct 2021', lastTreatment: 'Tooth Scaling' },
    { id: 4, name: 'Deanna Curtis', phone: '(229) 555-0109', email: 'deanna.curtis@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 09, 2021', lastVisit: '26 Oct 2020', lastTreatment: 'Root Canal Treatment' },
    { id: 5, name: 'Nathan Roberts', phone: '(209) 555-0104', email: 'nathan.roberts@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 06, 2021', lastVisit: '21 Mar 2021', lastTreatment: 'Tooth Scaling' },
    { id: 6, name: 'Bill Sanders', phone: '(207) 555-0119', email: 'bill.sanders@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 05, 2021', lastVisit: '22 Jan 2020', lastTreatment: 'Tooth Scaling' },
    { id: 7, name: 'Alma Lawson', phone: '(808) 555-0111', email: 'alma.lawson@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 04, 2021', lastVisit: '16 Apr 2021', lastTreatment: 'Dental Crown and Bridge' },
    { id: 8, name: 'Debra Holt', phone: '(205) 555-0100', email: 'debra.holt@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 05, 2021', lastVisit: '23 Mar 2020', lastTreatment: 'Tooth Scaling' },
    { id: 9, name: 'Micheal Mitc', phone: '(219) 555-0114', email: 'michael.mitc@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 06, 2021', lastVisit: '27 Jun 2021', lastTreatment: 'Tooth Scaling' },
    { id: 10, name: 'Kenzi Lawson', phone: '(270) 555-0117', email: 'kenzi.lawson@mail.com', imageUrl: 'https://via.placeholder.com/40', registered: 'Mar 06, 2021', lastVisit: '01 May 2021', lastTreatment: 'Tooth Scaling' },
];

const PatientTable: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, patient: Patient) => {
        setAnchorEl(event.currentTarget);
        setSelectedPatient(patient);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPatient(null);
    };

    const handleEdit = () => {
        console.log('Edit:', selectedPatient);
        handleMenuClose();
    };

    const handleRemove = () => {
        console.log('Remove:', selectedPatient);
        handleMenuClose();
    };

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Registered</TableCell>
                        <TableCell>Last Visit</TableCell>
                        <TableCell>Last Treatment</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dummyData.map((patient) => (
                        <TableRow
                            key={patient.id}
                            onClick={() => console.log('Row Clicked:', patient)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell>
                                <Avatar alt={patient.name} src={patient.imageUrl} sx={{ marginRight: 2, display: 'inline-block', verticalAlign: 'middle' }} />
                                {patient.name}
                            </TableCell>
                            <TableCell>
                                <div>{patient.phone}</div>
                                <div>{patient.email}</div>
                            </TableCell>
                            <TableCell>{patient.registered}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>{patient.lastTreatment}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={(event) => handleMenuClick(event, patient)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleRemove}>Remove</MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default PatientTable;
