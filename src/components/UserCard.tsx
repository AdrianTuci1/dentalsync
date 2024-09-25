import React, { useState } from 'react';
import { Avatar, Box } from '@mui/material';
import UserDrawer from './UserDrawer';

const UserCard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle Drawer Open/Close
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      {/* User Card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
        }}
        onClick={toggleDrawer(true)}
      >
        <Avatar
          src="/user.png"
          alt="User Avatar"
          sx={{ width: 30, height: 30, marginRight: '0px', }}
        />
      </Box>

      {/* Drawer Component */}
      <UserDrawer open={drawerOpen} onClose={toggleDrawer(false)} />
    </>
  );
};

export default UserCard;
