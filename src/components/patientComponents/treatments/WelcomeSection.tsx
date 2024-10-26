import React from 'react';

const WelcomeSection: React.FC = () => {
  return (
    <div className="welcome-section">
      <img src="/path/to/patient-image.jpg" alt="Patient" className="patient-image" />
      <div className="patient-info">
        <h2>Welcome, John Doe</h2>
        <p>Age: 30</p>
      </div>
    </div>
  );
};

export default WelcomeSection;
