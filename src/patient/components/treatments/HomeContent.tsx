import React from 'react';
import { useSelector } from 'react-redux';
import AvailabilityCalendar from './AvailabilityComponent';
import UpcomingPreviousSection from '../home/UpcomingPreviousSection';
import TreatmentCategories from '../home/TreatmentCategories';
import ClinicDescription from '../home/ClinicDescription';
import '../../styles/homeSection.scss'
import Testimonials from '../home/Testimonials';
import Gallery from '../home/Gallery';

const busyDates = [
  new Date(2024, 10, 5),
  new Date(2024, 10, 12),
  new Date(2024, 10, 19),
  new Date(2024, 10, 26),
];

const moderateDates = [
  new Date(2024, 10, 6),
  new Date(2024, 10, 13),
  new Date(2024, 10, 20),
  new Date(2024, 10, 27),
];

const normalDates = [
  new Date(2024, 10, 7),
  new Date(2024, 10, 14),
  new Date(2024, 10, 21),
  new Date(2024, 10, 28),
];

const nonWorkingDays = [
  new Date(2024, 10, 2),
  new Date(2024, 10, 3),
  new Date(2024, 10, 9),
  new Date(2024, 10, 10),
  new Date(2024, 10, 16),
  new Date(2024, 10, 17),
];

const TreatmentList: React.FC = () => {
  const authState = useSelector((state: any) => state.auth);
  const isAuthenticated = !!authState?.clinicUser;

  return (
    <div className="treatment-list">
        {/* Clinic Description */}
        {!isAuthenticated && (
        <div className="description-container">
          <ClinicDescription />
        </div>
      )}
      <div className="grid">
        {/* Conditionally render Upcoming/Previous or Categories */}
        {isAuthenticated ? (
          <UpcomingPreviousSection />
        ) : (
          <TreatmentCategories />
        )}

        {/* Calendar */}
        <div className="availability">
          <AvailabilityCalendar
            busyDates={busyDates}
            moderateDates={moderateDates}
            normalDates={normalDates}
            nonWorkingDays={nonWorkingDays}
          />
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials">
        <Testimonials />
      </div>

      {/* Gallery */}
      <div className="gallery">
        <Gallery />
      </div>

    </div>
  );
};

export default TreatmentList;