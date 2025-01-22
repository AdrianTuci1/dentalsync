import { ExpandMore } from '@mui/icons-material';
import '../../styles/welcomeSection.scss';
import { useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";


const WelcomeSection: React.FC = () => {

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
      {/* Background Container with Mirroring */}
      <div className="background-container rectangle">
        <img src="/democlinic.jpg" alt="Background" className="background-image" />
        <div className="overlay"></div>
      </div>

      {/* Content */}
      <div className="content-container">
        {/* Logo and Clinic Info */}
        <div className="logo-container">
          <img src={selectedClinic.logo} alt="Clinic Logo" className="logo" />
        </div>

        <div className="clinic-address">
          <p className="clinic-location"><FaLocationDot />Calea Mosilor Nr.14</p>
        </div>

        <div className="clinic-info-container">
          <div className="info-wrap-nc">
          <h2 className="clinic-name">{selectedClinic.name}</h2>
          <p className="clinic-city">{selectedClinic.city}</p>
          </div>


                  {/* Dropdown Menu */}
        <div className="dropdown-container">
          <button
            className="dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <ExpandMore />
          </button>
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
        </div>


      </div>

    </div>
  );
};

export default WelcomeSection;