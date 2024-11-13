import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, ListItemButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NotificationSettings from './submenu/NotificationsSettings';
import PasswordManager from './submenu/PasswordManager';
import DeleteAccount from './submenu/DeleteAccount';
import './settings.scss';

const Settings: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('SettingsMenu');

  const handleNavigate = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleBack = () => {
    setActiveMenu('SettingsMenu');
  };

  return (
    <div className="settings-container">
      {activeMenu === 'SettingsMenu' && (
        <div className="settings-menu">
          <h2 className="settings-title">Settings</h2>
          
          <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate('NotificationSettings')}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notification Settings" />
              <IconButton edge="end">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate('PasswordManager')}>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Password Manager" />
              <IconButton edge="end">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate('DeleteAccount')}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Delete Account" />
              <IconButton edge="end">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </ListItemButton>
          </ListItem>

          </List>
        </div>
      )}

      {activeMenu === 'NotificationSettings' && (
        <NotificationSettings onBack={handleBack} />
      )}

      {activeMenu === 'PasswordManager' && (
        <PasswordManager onBack={handleBack} />
      )}

      {activeMenu === 'DeleteAccount' && (
        <DeleteAccount onBack={handleBack} />
      )}
    </div>
  );
};

export default Settings;
