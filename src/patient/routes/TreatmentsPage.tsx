import React from 'react';
import WelcomeSection from '../components/treatments/WelcomeSection';
import TreatmentList from '../components/treatments/TreatmentList';
import RequestAppointmentButton from '../components/treatments/RequestAppointmentButton';
import '../styles/treatmentsPage.scss';

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
      