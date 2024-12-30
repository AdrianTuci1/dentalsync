import React from 'react';
import WelcomeSection from '../components/treatments/WelcomeSection';
import RequestAppointmentButton from '../components/treatments/RequestAppointmentButton';
import '../styles/treatmentsPage.scss';
import HomeContent from '../components/treatments/HomeContent';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {

  return (
    <>
    <div className="outline">
      <div className="treatments-page">
        <WelcomeSection/>
        <HomeContent />
        {/* Footer */}
        <Footer />
      </div>
      <RequestAppointmentButton />
    </div>
    </>
  );
};

export default HomePage;
      