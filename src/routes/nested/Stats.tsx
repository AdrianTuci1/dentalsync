import '../../styles/windows/stats.scss';
import ClinicStats from '../../components/stats/ClinicStats';
import ClinicVisits from '../../components/stats/ClinicVisits';
import ClinicPatients from '../../components/stats/ClinicPatients';
import ClinicAppointments from '../../components/stats/ClinicAppointments';
import ClinicReviews from '../../components/stats/ClinicReviews';
import { useState, useEffect } from 'react';
import { Appointment, ClinicPatientsData, ClinicStatsData, ClinicVisitsData, Review } from '../../types/statsType';

const Stats: React.FC = () => {
  const [data, setData] = useState<{
    clinicStats: ClinicStatsData;
    visitsData: ClinicVisitsData;
    patientsData: ClinicPatientsData;
    appointments: Appointment[];
    reviews: Review[];
  }>({
    clinicStats: {
      totalPatients: 680,
      interventions: 1100,
      staffMembers: 15,
      appointments: 210,
    },
    visitsData: {
      male: [50, 60, 70, 80, 90, 40, 60, 80, 30, 50, 60, 10],
      female: [40, 50, 60, 70, 50, 60, 80, 30, 40, 70, 50, 20],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    },
    patientsData: {
      male: [30, 45, 50, 60, 35, 55, 40],
      female: [25, 35, 45, 50, 40, 60, 50],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    appointments: [
      { name: 'John Doe',image:'/avatar1.avif', gender: 'Male', date: '2024-08-25', time: '10:00', action: 'View' },
      { name: 'Jane Smith',image:'/avatar2.avif', gender: 'Female', date: '2024-08-26', time: '11:00', action: 'View' },
    ],
    reviews: [
      { medic: 'Dr. John', image:'/avatar1.avif', rating: 5, patients: 100 },
      { medic: 'Dr. Sarah', image:'/avatar2.avif', rating: 4, patients: 120 },
      { medic: 'Dr. Mark', image:'/avatar3.avif', rating: 4, patients: 170 },
    ],
  });

  useEffect(() => {
    // Simulate data fetching here
  }, []);

  return (
    <div className="stats-window">
      <div className="clinic-stats">
        <ClinicStats data={data.clinicStats} />
      </div>
      <div className="visits-patients">
        <div className="clinic-visits">
          <ClinicVisits data={data.visitsData} />
        </div>
        <div className="clinic-patients">
          <ClinicPatients data={data.patientsData} />
        </div>
      </div>
      <div className="appointments-review">
        <div className="clinic-appointments">
          <ClinicAppointments data={data.appointments} />
        </div>
        <div className="clinic-reviews">
          <ClinicReviews data={data.reviews} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
