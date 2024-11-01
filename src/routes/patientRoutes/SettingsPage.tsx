
import '../../styles/patientDashboard/settingsPage.scss'
// SettingsPage.tsx
import React from 'react';
import { Avatar, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';

const SettingsPage: React.FC = () => {
  const user = {
    name: 'Esther Howard',
    profilePicture: '', // Add the path to the user's profile picture
  };

  // Define the menu items with the icons as component references
  const menuItems = [
    { label: 'Your profile', icon: PersonIcon, action: () => console.log('Profile') },
    { label: 'Files', icon: FolderIcon, action: () => console.log('Files') },
    { label: 'Dental History', icon: HistoryIcon, action: () => console.log('Dental History') },
    { label: 'Settings', icon: SettingsIcon, action: () => console.log('Settings') },
    { label: 'Help Center', icon: HelpIcon, action: () => console.log('Help Center') },
    { label: 'Log out', icon: LogoutIcon, action: () => console.log('Log out') },
  ];

  return (
    <div className="settings-page">
      <div className="profile-header">
        <IconButton className="back-button" onClick={() => console.log('Back')}>
          {/* Add an icon for the back button if needed, e.g., <ArrowBackIcon /> */}
        </IconButton>
        <Typography variant="h6" className="profile-title">Profile</Typography>
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
          const IconComponent = item.icon; // Save icon as a component

          return (
            <ListItem 
              key={index} 
              onClick={item.action} 
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
  );
};

export default SettingsPage;

