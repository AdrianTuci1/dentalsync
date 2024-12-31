import React from 'react';
import WelcomeSection from '../components/treatments/WelcomeSection';
import '../styles/treatmentsPage.scss';
import HomeContent from '../components/treatments/HomeContent';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {

  return (
    <>
    <div className="outline">
      <div className="treatments">
        <WelcomeSection/>
        <HomeContent />
        {/* Footer */}
        <Footer />
      </div>
    </div>
    </>
  );
};

export default HomePage;
      