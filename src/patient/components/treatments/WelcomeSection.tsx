import '../../styles/welcomeSection.scss';
import { useState } from 'react';
import LocationMap from './LocationMap';
import { ArrowDownward } from '@mui/icons-material';

const WelcomeSection: React.FC = () => {
  const position: [number, number] = [44.4268, 26.1025];
  const clinics = [
    { id: 1, name: "Shinedent", city: "Bucharest", logo: "/logoclinic.png" },
    { id: 2, name: "BrightSmile", city: "Cluj", logo: "/logoclinic2.png" },
  ];
  const [selectedClinic, setSelectedClinic] = useState(clinics[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClinicChange = (clinicId: number) => {
    const clinic = clinics.find((c) => c.id === clinicId);
    if (clinic) {
      setSelectedClinic(clinic);
      setDropdownOpen(false); // Close dropdown after selection
    }
  };

  return (
    <div className="welcome-section">
      <div className="background-container rectangle">
        <img src="/democlinic.jpg" alt="Background" className="background-image" />
        <div className="overlay"></div>
      </div>

      <div className="outline-box">
        <div className="dropdown-box" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="dropdown-content">
            <img src={selectedClinic.logo} alt="Clinic Logo" className="clinic-logo" />
            <div className="clinic-info">
              <h2>{selectedClinic.name}</h2>
              <p>{selectedClinic.city}</p>
            </div>
            <div className="arrow">
              <ArrowDownward />
            </div>
          </div>
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            {clinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => handleClinicChange(clinic.id)}
                className={selectedClinic.id === clinic.id ? "active" : ""}
              >
                <img src={clinic.logo} alt={`${clinic.name} Logo`} className="menu-logo" />
                <div className="menu-info">
                  <h3>{clinic.name}</h3>
                  <p>{clinic.city}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="map-section">
        <LocationMap position={position} />
      </div>
    </div>
  );
};

export default WelcomeSection;