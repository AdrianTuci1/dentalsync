import React from 'react';
import { Avatar, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { openDrawer } from '@/components/drawerSlice';

const UserCard: React.FC = () => {
  const dispatch = useDispatch();

  // Handle Drawer Open
  const handleOpenDrawer = () => {
    dispatch(
      openDrawer({
        type: 'User',
        data: {},
      })
    );
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
        onClick={handleOpenDrawer}
      >
        <Avatar
          src="/user.png"
          alt="User Avatar"
          sx={{ width: 30, height: 30, marginRight: '0px' }}
        />
      </Box>
    </>
  );
};

export default UserCard;
