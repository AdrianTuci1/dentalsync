import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Dialog, Drawer, useMediaQuery, IconButton } from '@mui/material';
import ConsultationCard from '../../components/patientComponents/ConsultationCard';
import ConsultationDetailsPage from '../../components/patientComponents/ConsultationDetail';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  // Determine screen size for conditional rendering
  const isLargeScreen = useMediaQuery('(min-width:850px)');

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
        isLargeScreen ? (
          <Drawer
            anchor="right"
            open={openDetails}
            onClose={handleCloseDetails}
            PaperProps={{
              style: { width: 400 },
            }}
          >
            <ConsultationDetailsPage consultation={selectedConsultation} onCancel={handleCloseDetails} />
            <IconButton onClick={handleCloseDetails} style={{ position: 'absolute', top: 10, right: 10 }}>
              <ExpandMoreIcon />
            </IconButton>
          </Drawer>
        ) : (
          <Dialog open={openDetails} onClose={handleCloseDetails} fullScreen>
            <ConsultationDetailsPage consultation={selectedConsultation} onCancel={handleCloseDetails} />
            <IconButton onClick={handleCloseDetails} style={{ position: 'absolute', top: 10, right: 10 }}>
              <ExpandMoreIcon />
            </IconButton>
          </Dialog>
        )
      )}
    </div>
  );
};

export default ConsultationsPage;
