import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaUserMd, FaClock } from 'react-icons/fa';
import '../styles/dailyStats.scss'; // Create or update the SCSS file for styling

const DailyStats: React.FC = () => {
  const [stats, setStats] = useState({
    patientsToday: 0,
    medicsAvailable: 0,
    openTime: '8:00 AM',
    closeTime: '6:00 PM',
  });

  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const response = await Promise.resolve({
        patientsToday: 15,
        medicsAvailable: 3,
        openTime: '8:00 AM',
        closeTime: '6:00 PM',
      });

      setStats(response);
    };

    fetchData();

    // Format the current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="stats-box">
      <div className="daily-stats">
        <div className="date-part">
          <div className="date">{currentDate}</div>
          <p> Moderate </p>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-box">
            <FaUserInjured className="stat-icon" />
            </div>
            <span className="stat-value">{stats.patientsToday} Patients</span>
          </div>
          <div className="stat-item">
            <div className="stat-box">
            <FaUserMd className="stat-icon" />
            </div>
            <span className="stat-value">{stats.medicsAvailable} Medics</span>
          </div>
          <div className="stat-item full-width">
            <div className="stat-box">
            <FaClock className="stat-icon" />
            </div>
            <span className="stat-value">
              {stats.openTime} - {stats.closeTime}
            </span>
          </div>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item normal">
          <div className="legend-color"></div>
          <span className="legend-text">Normal</span>
        </div>
        <div className="legend-item moderate">
          <div className="legend-color"></div>
          <span className="legend-text">Moderate</span>
        </div>
        <div className="legend-item busy">
          <div className="legend-color"></div>
          <span className="legend-text">Busy</span>
        </div>
        <div className="legend-item non-working">
          <div className="legend-color"></div>
          <span className="legend-text">Non-Working</span>
        </div>
      </div>
    </div>
  );
};

export default DailyStats;