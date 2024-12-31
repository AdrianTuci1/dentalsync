import React from 'react';
import '../styles/pages/medicsPage.scss';
import PhoneIcon from '@mui/icons-material/Phone';
import { Divider } from '@mui/material';

const medicsData = [
  {
    name: 'Dr. Jane Smith',
    speciality: 'Orthodontist',
    phone: '+40 123 456 789',
    photo: '/avatar1.avif',
    workingDays: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    name: 'Dr. John Doe',
    speciality: 'Periodontist',
    phone: '+40 987 654 321',
    photo: '/avatar2.avif',
    workingDays: ['Tuesday', 'Thursday', 'Saturday'],
  },
  {
    name: 'Dr. Emily Johnson',
    speciality: 'Cosmetic Dentist',
    phone: '+40 456 789 123',
    photo: '/path/to/photo3.jpg',
    workingDays: ['Monday', 'Thursday', 'Saturday'],
  },
];

const MedicsPage: React.FC = () => {
  return (
    <div className="outer-layer">
        <div className="medics-page">
        {medicsData.map((medic, index) => (
            <MedicCard key={index} medic={medic} />
        ))}
        </div>
    </div>
  );
};

const MedicCard: React.FC<{ medic: typeof medicsData[0] }> = ({ medic }) => {
  const daysOfWeek = [
    { full: 'Monday', short: 'M' },
    { full: 'Tuesday', short: 'T' },
    { full: 'Wednesday', short: 'W' },
    { full: 'Thursday', short: 'T' },
    { full: 'Friday', short: 'F' },
    { full: 'Saturday', short: 'S' },
    { full: 'Sunday', short: 'S' },
  ];

  return (
    <div className="medic-card">
      <div className="row">
        <img src={medic.photo} alt={medic.name} className="medic-photo" />
        <div className="medic-info">
          <h3 className="medic-name">{medic.name}</h3>
          <p className="medic-speciality">{medic.speciality}</p>
          <p className="medic-phone">
            <PhoneIcon className="phone-icon" /> {medic.phone}
          </p>
        </div>
      </div>
      <Divider />
      <div className="working-days">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className={`working-day-circle ${medic.workingDays.includes(day.full) ? 'active' : ''}`}
          >
            {day.short}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicsPage;