import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface NotificationSettingsProps {
  onBack: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  return (
    <div className="notification-settings">
      <div className="header">
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <h2>Notification Settings</h2>
      </div>
      <div className="content">
        <p>Here, you can adjust your notification preferences.</p>
        {/* Add more notification settings options here */}
      </div>
    </div>
  );
};

export default NotificationSettings;
