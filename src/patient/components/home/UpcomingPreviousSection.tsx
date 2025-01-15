import React from 'react';
import ConsultationCard from '../ConsultationCard';
import '../../styles/upcomingPreviousSection.scss'

const upcomingAppointment = {
  id: '2',
  medicName: 'Dr. Jane Smith',
  medicImage: '/path/to/image2.jpg',
  treatmentName: 'Root Canal',
  date: '22 Dec 2024',
  time: '10:00 - 11:00',
};

const previousAppointment = {
  id: '1',
  medicName: 'Dr. John Doe',
  medicImage: '/path/to/image1.jpg',
  treatmentName: 'Dental Cleaning',
  date: '20 Dec 2024',
  time: '09:00 - 10:00',
};

const UpcomingPreviousSection: React.FC = () => {
  return (
    <div className="sections">
      <div className="appointment-section">
        <h3>Upcoming</h3>
        {upcomingAppointment ? (
          <ConsultationCard 
            consultation={upcomingAppointment}
            onClick={() => ''}
          />
        ) : (
          <p>No upcoming appointment</p>
        )}
      </div>
      <div className="appointment-section">
        <h3>Previous</h3>
        {previousAppointment ? (
          <ConsultationCard 
            consultation={previousAppointment}
            onClick={() => ''}
          />
        ) : (
          <p>No previous appointment</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingPreviousSection;