import '../../styles/welcomeSection.scss';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import LocationMap from './LocationMap';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ScheduleIndicator from '../ScheduleIndicator';

const WelcomeSection: React.FC = () => {
  const authState = useSelector((state: any) => state.auth); // Access authentication state
  const user = authState?.subaccountUser?.name || authState?.clinicUser?.name || ''; // Get user name from auth state

  const position: [number, number] = [44.4268, 26.1025];
  const clinicName = "Shinedent";
  const location = "Bulevardul Dacia Nr.84";
  const city = 'Bucharest';
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');

  const greeting = "welcome back!";

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toDateString());
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch temperature data (Example with a dummy temperature API or fixed value)
  useEffect(() => {
    const fetchTemperature = async () => {
      // Replace this with an actual API call if needed
      const temp = "25°C"; // Dummy temperature
      setTemperature(temp);
    };

    fetchTemperature();
  }, []);

  return (
    <div className="added-map">
      <div className="welcome-section">
        <img src="/democlinic.jpg" alt="Background" className="background-image" />
        <div className="overlay"></div> {/* Overlay for transparency */}
        <div className="header">
          <img src="/logoclinic.png" alt="Clinic Logo" className="clinic-logo" />
          <div className="clinic-info">
            <ScheduleIndicator />
            <div className="info-detail">
            <h3>{clinicName}</h3>
            <p>{city}</p>
            </div>
          </div>
          <div className="empty"></div>
        </div>
        <div className="content">
          <p className="date">{currentDate}</p>
          {user ? (
            <h2 className="greeting">Hi {user}, {greeting}</h2>
          ) : (
            <h2 className="greeting">{currentTime}, {temperature}</h2>
          )}
        </div>
        <div className="location">
          <div
            className="loc-info"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
          >
            <FmdGoodIcon />
            <p>{location}</p>
          </div>
        </div>
      </div>
      <div className="map-part">
        <LocationMap position={position} />
      </div>
    </div>
  );
};

export default WelcomeSection;