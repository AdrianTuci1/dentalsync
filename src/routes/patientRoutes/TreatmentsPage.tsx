import React from 'react';
import WelcomeSection from '../../components/patientComponents/treatments/WelcomeSection';
import TreatmentList from '../../components/patientComponents/treatments/TreatmentList';
import RequestAppointmentButton from '../../components/patientComponents/treatments/RequestAppointmentButton';
import '../../styles/patientDashboard/treatmentsPage.scss';

const TreatmentsPage: React.FC = () => {
  const clinicName = "Shinedent";
  const location = "Bucharest";
  const currentDate = "Fri, 20 Dec";
  const patientName = "Andrew";
  const greeting = "Good Morning";

  return (
    <>
    <div className="outline">
      <div className="treatments-page">
        <WelcomeSection
          clinicName={clinicName}
          location={location}
          currentDate={currentDate}
          patientName={patientName}
          greeting={greeting}
        />
        <TreatmentList />
      </div>
      <RequestAppointmentButton />
    </div>
    </>
  );
};

export default TreatmentsPage;
      