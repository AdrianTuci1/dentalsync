import React from 'react';
import WelcomeSection from '../../components/patientComponents/treatments/WelcomeSection';
import TreatmentList from '../../components/patientComponents/treatments/TreatmentList';
import RequestAppointmentButton from '../../components/patientComponents/treatments/RequestAppointmentButton';
import '../../styles/patientDashboard/treatmentsPage.scss';

const TreatmentsPage: React.FC = () => {
  return (
    <div className="treatments-page">
      <WelcomeSection />
      <TreatmentList />
      <RequestAppointmentButton />
    </div>
  );
};

export default TreatmentsPage;
