import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExitToApp,
  AccountCircle,
  Dashboard,
  Phone,
  HomeOutlined,
  EventNoteOutlined,
  SettingsOutlined,
  HistoryOutlined,
  MedicalServicesOutlined,
} from '@mui/icons-material';
import '../styles/Navbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../shared/services/authSlice';
import { useMediaQuery } from '@mui/material';

interface DesktopNavbarProps {
  activePage: string;
  availablePages: string[];
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ activePage, availablePages }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth); // Access auth state
  const isAuthenticated = !!authState.clinicUser;
  const isClinicUser = authState?.clinicUser?.role === 'clinic'; // Check if the user is clinic

  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  const handleLogOut = () => {
    dispatch(logout());
  };

  const navItems = [
    { section: 'home', icon: <HomeOutlined />, path: '/' },
    { section: 'treatments', icon: <EventNoteOutlined />, path: '/treatments' },
    ...(isSmallScreen ? [{ section: 'dashboard', icon: <Dashboard />, path: '/dashboard' }] : []),
    { section: 'medics', icon: <MedicalServicesOutlined />, path: '/medics' },
    { section: 'consultations', icon: <HistoryOutlined />, path: '/consultations' },
    { section: 'settings', icon: <SettingsOutlined />, path: '/settings' },
  ];

  return (
    <nav className="navbar desktop-navbar">
      {/* Left-side Navigation */}
      <ul className={window.innerWidth > 1024 ? "navbar-left pad" : "mobile-navbar"}>
        {navItems
          .filter((item) => availablePages.includes(item.section))
          .map(({ section, icon, path }) => (
            <li key={section}>
              <Link to={path} className="nav-link">
                <div className={`icon-box ${activePage === section ? 'selected' : ''}`}>
                  {icon}
                </div>
              </Link>
            </li>
          ))}
      </ul>
      

      {/* Right-side Navigation */}
      <ul className="navbar-right pad">
        {isClinicUser ? (
          <li>
            <Link to="/dashboard" className="nav-link">
              <div className={`icon-box ${activePage === 'dashboard' ? 'selected' : ''}`}>
                <Dashboard />
              </div>
            </Link>
          </li>
        ) : (
          <li>
            <div className="icon-box">
              <Phone />
            </div>
          </li>
        )}
        {!isAuthenticated && (
          <li>
            <Link to="/login" className="nav-link">
              <div className="icon-box">
                <AccountCircle />
              </div>
            </Link>
          </li>
        )}
        {isAuthenticated && (
          <li onClick={handleLogOut}>
            <div className="icon-box">
              <ExitToApp />
            </div>
          </li>
        )}
      </ul>

            {/* Login link for unauthenticated users on small screens */}
            {isSmallScreen && !isAuthenticated && (
        <div className="login-section pad">
          <ul><li><div className="icon-box">
          <Link to="/login" className="nav-link">
              <AccountCircle />
          </Link>
          </div></li></ul>
        </div>
      )}
    </nav>
  );
};

export default DesktopNavbar;