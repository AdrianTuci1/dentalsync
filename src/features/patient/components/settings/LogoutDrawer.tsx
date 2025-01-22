// LogoutDrawer.tsx
import React from 'react';
import { Drawer, Typography, Button } from '@mui/material';

interface LogoutDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutDrawer: React.FC<LogoutDrawerProps> = ({ open, onClose, onLogout }) => {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <div className="logout-drawer" style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h6" align="center" style={{ marginBottom: '16px' }}>
          Logout
        </Typography>
        <Typography align="center" style={{ marginBottom: '16px' }}>
          Are you sure you want to log out?
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px' }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onLogout}>
            Yes, Logout
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default LogoutDrawer;
