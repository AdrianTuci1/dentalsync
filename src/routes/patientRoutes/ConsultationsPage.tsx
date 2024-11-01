import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Dialog } from '@mui/material';
import ConsultationCard from '../../components/patientComponents/ConsultationCard';
import ConsultationDetailsPage from '../../components/patientComponents/ConsultationDetail';
import '../../styles/patientDashboard/consultationPage.scss';

interface Consultation {
  id: string;
  medicName: string;
  medicImage: string;
  treatmentName: string;
  date: string;
  time: string;
  status?: string;
}

const consultationsData: Consultation[] = [
  {
    id: '1',
    medicName: 'Dr. John Doe',
    medicImage: '/path/to/image1.jpg',
    treatmentName: 'Dental Cleaning',
    date: '20 Dec 2024',
    time: '09:00 - 10:00',
    status: 'Completed',
  },
  {
    id: '2',
    medicName: 'Dr. Jane Smith',
    medicImage: '/path/to/image2.jpg',
    treatmentName: 'Root Canal',
    date: '22 Dec 2024',
    time: '10:00 - 11:00',
    status: 'Upcoming',
  },
];

const ConsultationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const filterConsultations = (tabIndex: number) => {
    const statusMap = ['Upcoming', 'Completed'];
    const filteredConsultations = consultationsData.filter(
      (consultation) => consultation.status === statusMap[tabIndex]
    );
    setConsultations(filteredConsultations);
  };

  useEffect(() => {
    filterConsultations(activeTab);
  }, [activeTab]);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
    filterConsultations(newValue);
  };

  const handleCardClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedConsultation(null);
  };

  return (
    <div className="consultations-page">
      <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
        <Typography variant="h5">My Appointments</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Upcoming" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      <div className="consultation-cards">
        {consultations.length > 0 ? (
          consultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              onClick={() => handleCardClick(consultation)}
            />
          ))
        ) : (
          <p>No consultations found</p>
        )}
      </div>

      {selectedConsultation && (
        <Dialog open={openDetails} onClose={handleCloseDetails} fullScreen>
          <ConsultationDetailsPage consultation={selectedConsultation} onCancel={handleCloseDetails} />
        </Dialog>
      )}
    </div>
  );
};

export default ConsultationsPage;
