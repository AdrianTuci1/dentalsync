import React from 'react';
import { Home, Assignment, Person, Settings } from '@mui/icons-material';
import '../../styles/patientDashboard/Navbar.scss'

interface MobileNavbarProps {
  onSelect: (section: string) => void;
  activePage: string;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onSelect, activePage }) => {
    return (
      <nav className="navbar mobile-navbar">
        <ul>
          <li onClick={() => onSelect('treatments')}>
            <div className={`icon-box ${activePage === 'treatments' ? 'selected' : ''}`}>
              <Home />
            </div>
          </li>
          <li onClick={() => onSelect('consultations')}>
            <div className={`icon-box ${activePage === 'consultations' ? 'selected' : ''}`}>
              <Assignment />
            </div>
          </li>
          <li onClick={() => onSelect('profile')}>
            <div className={`icon-box ${activePage === 'profile' ? 'selected' : ''}`}>
              <Person />
            </div>
          </li>
          <li onClick={() => onSelect('settings')}>
            <div className={`icon-box ${activePage === 'settings' ? 'selected' : ''}`}>
              <Settings />
            </div>
          </li>
        </ul>
      </nav>
    );
  };
  

export default MobileNavbar;
