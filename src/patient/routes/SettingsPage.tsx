import '../styles/settingsPage.scss';
import React, { useState } from 'react';
import { Avatar, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import LogoutDrawer from '../components/settings/LogoutDrawer';
import YourProfile from '../components/settings/YourProfile';
import Files from '../components/settings/Files';
import DentalHistory from '../components/settings/DentalHistory';
import Settings from '../components/settings/Settings';
import HelpCenter from '../components/settings/HelpCenter';
import { logout } from '../../shared/services/authSlice';
import { useDispatch } from 'react-redux';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch()
  const user = {
    name: 'Esther Howard',
    profilePicture: '', // Add the path to the user's profile picture or leave empty for default
  };

  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(null);
  const [logoutDrawerOpen, setLogoutDrawerOpen] = useState(false);

  const menuItems = [
    { label: 'Your Profile', icon: PersonIcon, component: <YourProfile onClose={() => setActiveComponent(null)} /> },
    { label: 'Files', icon: FolderIcon, component: <Files /> },
    { label: 'Dental History', icon: HistoryIcon, component: <DentalHistory /> },
    { label: 'Settings', icon: SettingsIcon, component: <Settings /> },
    { label: 'Help Center', icon: HelpIcon, component: <HelpCenter /> },
    { label: 'Log out', icon: LogoutIcon, action: () => setLogoutDrawerOpen(true) },
  ];

  const handleMenuItemClick = (item: any) => {
    if (item.label === 'Log out') {
      setLogoutDrawerOpen(true);
    } else {
      setActiveComponent(item.component);
    }
  };

  const handleLogoutClose = () => setLogoutDrawerOpen(false);


  const handleLogOut = () => {
    dispatch(logout());
  };

  return (
    <div className={`settings-page ${activeComponent ? 'split-view' : ''}`}>
      <div className="main-content">
        <div className="profile-header">
          <Typography variant="h5" className="profile-title">Profile</Typography>
        </div>
        
        <div className="profile-section">
          <Avatar
            src={user.profilePicture || '/path/to/default/avatar.jpg'}
            alt={user.name}
            className="profile-avatar"
          />
          <IconButton className="edit-avatar-button">
            <EditIcon />
          </IconButton>
          <Typography variant="h6" className="user-name">{user.name}</Typography>
        </div>

        <List className="settings-menu">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <ListItem 
                key={index} 
                onClick={() => handleMenuItemClick(item)}
                className="menu-item"
                component="li"
              >
                <IconComponent style={{ marginRight: 15 }} />
                <ListItemText primary={item.label} />
                <ArrowForwardIosIcon fontSize="small" />
              </ListItem>
            );
          })}
        </List>
      </div>

      {/* Active Menu Content Area */}
      {activeComponent && (
        <div className="menu-content">
          <IconButton className="close-button" onClick={() => setActiveComponent(null)}>
            Close
          </IconButton>
          {activeComponent}
        </div>
      )}

      {/* Logout Modal */}
      {logoutDrawerOpen && (
        <LogoutDrawer open={logoutDrawerOpen} onClose={handleLogoutClose} onLogout={() => handleLogOut()}/>
      )}
    </div>
  );
};

export default SettingsPage;
