import '../../../styles/patientDashboard/welcomeSection.scss'
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import LocationMap from './LocationMap';

interface WelcomeSectionProps {
  clinicName: string;
  location: string;
  currentDate: string;
  patientName: string;
  greeting: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  clinicName,
  location,
  currentDate,
  patientName,
  greeting,
}) => {

  const position: [number, number] = [44.4268, 26.1025];

  return (
    <div className='added-map'>
    <div className="welcome-section">
      <img src="/democlinic.jpg" alt="Background" className="background-image" />
      <div className="overlay"></div> {/* Overlay for transparency */}
      <div className="header">
        <img src="/logoclinic.png" alt="Clinic Logo" className="clinic-logo" />
        <div className="clinic-info">
          <h3>{clinicName}</h3>
          <p>{location}</p>
        </div>
        <div className="empty"></div>
      </div>
      <div className="content">
        <p className="date">{currentDate}</p>
        <h2 className="greeting">Hi {patientName}, {greeting}!</h2>
      </div>
      <div className="location">
        <div className="loc-info" style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'10px'}}>
        <FmdGoodIcon />
        <p>Bulevardul Dacia Nr.84</p>
        </div>
      </div>
    </div>
    <div className="map-part">
    <LocationMap position={position}/>
    </div>
    </div>
  );
};

export default WelcomeSection;