
import '../../styles/patientDashboard/consultationPage.scss';

// ConsultationsPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, TextField } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface Consultation {
  id: string;
  status: string;
  treatmentColor: string;
  initials: string;
  treatmentName: string;
  medicName: string;
  date: string;
}

const consultationsData: Consultation[] = [
  {
    id: '1',
    status: 'Completed',
    treatmentColor: '#4caf50',
    initials: 'DC',
    treatmentName: 'Dental Cleaning',
    medicName: 'Dr. John Doe',
    date: '20 Dec 2024',
  },
  {
    id: '2',
    status: 'Pending',
    treatmentColor: '#ff9800',
    initials: 'RC',
    treatmentName: 'Root Canal',
    medicName: 'Dr. Jane Smith',
    date: '22 Dec 2024',
  },
  // Add more consultations as needed
];

const ConsultationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [consultations, setConsultations] = useState<Consultation[]>(consultationsData);

  const handleCardClick = (id: string) => {
    console.log('Navigate to consultation details for ID:', id);
    // Future navigation logic will go here
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setConsultations(
      consultationsData.filter(
        (consultation) =>
          consultation.status.toLowerCase().includes(term) ||
          consultation.treatmentName.toLowerCase().includes(term) ||
          consultation.medicName.toLowerCase().includes(term) ||
          consultation.date.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="consultations-page">
      <TextField
        label="Search Consultations"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
        margin="normal"
      />
      {consultations.map((consultation) => (
        <Card key={consultation.id} className="consultation-card">
          <CardContent className="card-content">
            <Typography variant="body2" className="status-text">
              {consultation.status}
            </Typography>
            <div className="treatment-section">
              <div
                className="color-box"
                style={{ backgroundColor: consultation.treatmentColor }}
              >
                <Typography variant="body2" className="initials">
                  {consultation.initials}
                </Typography>
              </div>
              <Typography variant="body1" className="treatment-name">
                {consultation.treatmentName}
              </Typography>
            </div>
            <Typography variant="body2" className="medic-name">
              {consultation.medicName}
            </Typography>
            <Typography variant="body2" className="date">
              {consultation.date}
            </Typography>
            <IconButton
              className="arrow-icon"
              size="small"
              onClick={() => handleCardClick(consultation.id)}
            >
              <ArrowForward />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsultationsPage;
