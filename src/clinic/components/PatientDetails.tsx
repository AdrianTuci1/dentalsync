import React from 'react';
import { Avatar, Button, Typography, Box, Tabs, Tab, Grid, TextField, Breadcrumbs, Link } from '@mui/material';

interface PatientDetailsProps {
    patient: any;
    onBackToList: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, onBackToList }) => {
    const [activeTab, setActiveTab] = React.useState(0);
    const [quickNote, setQuickNote] = React.useState(patient.note || "");
    const [isEditingNote, setIsEditingNote] = React.useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const toggleEditNote = () => {
        setIsEditingNote(!isEditingNote);
    };

    const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuickNote(event.target.value);
    };

    return (
        <Box
            sx={{
                height: 'calc(100vh - 60px)', // Set the height of the component
                overflowY: 'auto', // Make content inside scrollable
                padding: 3,
            }}
        >
            {/* Breadcrumbs for navigation */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link
                    color="inherit"
                    onClick={onBackToList}
                    style={{ cursor: 'pointer' }}
                >
                    Patient List
                </Link>
                <Typography color="textPrimary">Patient Detail</Typography>
            </Breadcrumbs>

            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                    <Avatar alt={patient.name} src={patient.photoUrl} sx={{ width: 80, height: 80, marginRight: 2 }} />
                    <Box>
                        <Typography variant="h4">{patient.name}</Typography>

                        {/* Quick Note Editing */}
                        {isEditingNote ? (
                            <Box mt={1}>
                                <TextField
                                    value={quickNote}
                                    onChange={handleNoteChange}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                />
                                <Button size="small" onClick={toggleEditNote} variant="text" color="primary" sx={{ mt: 1 }}>
                                    Save
                                </Button>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" mt={1}>
                                <Typography variant="body2" color="textSecondary">
                                    {quickNote || "No note available"}
                                </Typography>
                                <Button size="small" onClick={toggleEditNote} variant="text" color="primary" sx={{ ml: 2 }}>
                                    Edit
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Create Appointment Button */}
                <Button variant="contained" color="primary" onClick={() => console.log('Create Appointment clicked')}>
                    Create Appointment
                </Button>
            </Box>

            {/* Tabs Section */}
            <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" aria-label="patient details tabs">
                <Tab label="Patient Information" />
                <Tab label="Appointment History" />
                <Tab label="Next Treatment" />
                <Tab label="Medical Record" />
            </Tabs>

            {/* Tab Content */}
            {activeTab === 0 && (
                <Box mt={3}>
                    <Typography variant="h6">PATIENT DATA</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography>Age: {patient.age}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>Gender: {patient.gender}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>Mobile number: {patient.phone}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>Address: {patient.address}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>Email Address: {patient.email}</Typography>
                        </Grid>
                    </Grid>

                    <Box mt={3}>
                        <Typography variant="h6">MEDICAL DATA</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography>Blood pressure: {patient.bloodPressure}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Particular sickness: {patient.sickness}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Allergic: {patient.allergic}</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Oral Hygiene Habits Section */}
                    <Box mt={3}>
                        <Typography variant="h6">ORAL HYGIENE HABITS</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography>Brushing Frequency: {patient.brushingFrequency}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Flossing Frequency: {patient.flossingFrequency}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Mouthwash Usage: {patient.mouthwashUsage}</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Attachment Section */}
                    <Box mt={3}>
                        <Typography variant="h6">ATTACHMENT</Typography>
                        <Grid container spacing={2}>
                            {patient.attachments && patient.attachments.length > 0 ? (
                                patient.attachments.map((attachment: any, index: number) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                            {attachment.name}
                                        </a>
                                    </Grid>
                                ))
                            ) : (
                                <Typography>No attachments available</Typography>
                            )}
                        </Grid>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default PatientDetails;
