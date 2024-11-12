import React from 'react';
import { Home, Assignment, Person, ChatBubble, Event, ExitToApp } from '@mui/icons-material';
import '../../styles/patientDashboard/Navbar.scss';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/authSlice';
import { openRequestAppointment } from '../../services/appointmentSlice';

interface DesktopNavbarProps {
  onSelect: (section: string) => void;
  activePage: string;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ onSelect, activePage }) => {
  const dispatch = useDispatch()

  const handleLogOut = () => {
    dispatch(logout());
  };


  return (
    <nav className="navbar desktop-navbar">
      <ul className="navbar-left">
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
            <ChatBubble />
          </div>
        </li>
        <li onClick={() => onSelect('settings')}>
          <div className={`icon-box ${activePage === 'settings' ? 'selected' : ''}`}>
            <Person />
          </div>
        </li>
      </ul>
      <ul className="navbar-right">
        <li onClick={() => dispatch(openRequestAppointment())}>
                      <div className="icon-box">
                          <Event />
                          <Typography>Request Appointment</Typography>
                      </div>
                  </li>
          <li onClick={() => handleLogOut()}>
            <div className="icon-box">
              <ExitToApp />
            </div>
          </li>
      </ul>
    </nav>
  );
};

export default DesktopNavbar;
