import React, { useState } from 'react';
import { Drawer, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { logout, switchAccount } from '../services/authSlice';
import { useDispatch } from 'react-redux';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ open, onClose }) => {

  const dispatch = useDispatch()
  const profile = {

    avatar: '/default-avatar.png',
    name: 'John Doe',
    role: 'Admin',
  }; // Mock profile data

  // Manage selected menu item
  const [selectedMenu, setSelectedMenu] = useState('today');

  // Menu items configuration
  const menuItems = [
    { key: 'today', label: 'Appointments for Today' },
    { key: 'upcoming', label: 'Upcoming Appointments' },
    { key: 'actions', label: 'Actions' },
  ];

  const handleLogOut = () => {
    dispatch(logout());
  }

  const handleSwitchAccount = () => {
    dispatch(switchAccount());
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={styles.drawerContainer}>
        {/* Drawer Header */}
        <div style={styles.drawerHeader}>
        {/* User Info in Drawer */}
        {profile && (
          <div style={styles.drawerUserInfo}>
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt="User Avatar"
              style={styles.drawerAvatar}
            />
            <div style={styles.usrInfo}>
            <p style={styles.drawerName}>{profile.name}</p>
            <p style={styles.drawerRole}>{profile.role}</p>
            </div>
          </div>
        )}

          <IconButton onClick={onClose} style={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Navigation Menu (Displayed as Row) */}
        <Divider />
        <div style={styles.menuRow}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              style={styles.menuItem}
              onClick={() => setSelectedMenu(item.key)}
            >
              <div
                style={{
                  ...styles.menuIcon,
                  backgroundColor: selectedMenu === item.key ? 'black' : 'lightgray',
                }}
              />
              {selectedMenu === item.key && <p style={styles.menuText}>{item.label}</p>}
            </div>
          ))}
        </div>

        {/* Actions Section for Selected "Actions" Menu */}
        {selectedMenu === 'actions' && (
          <div style={styles.actionsSection}>
            <button style={styles.actionButton} onClick={() => handleLogOut()}>Logout</button>
            <button style={styles.actionButton} onClick={() => handleSwitchAccount()}>Switch Account</button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

// Styles for the UserDrawer component
const styles: {
  drawerContainer: React.CSSProperties;
  drawerHeader: React.CSSProperties;
  closeButton: React.CSSProperties;
  drawerUserInfo: React.CSSProperties;
  drawerAvatar: React.CSSProperties;
  drawerName: React.CSSProperties;
  drawerRole: React.CSSProperties;
  menuRow: React.CSSProperties;
  menuItem: React.CSSProperties;
  menuIcon: React.CSSProperties;
  menuText: React.CSSProperties;
  actionsSection: React.CSSProperties;
  actionButton: React.CSSProperties;
  usrInfo: React.CSSProperties;
} = {
  drawerContainer: {
    width: '350px',
    padding: '20px',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent:'space-between'
  },
  closeButton: {
    color: 'gray',
  },
  drawerUserInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '20px',
    gap:'10px',
  },
  drawerAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    background:'gray',
  },
  drawerName: {
    margin: '10px 0 0 0',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  drawerRole: {
    margin: 0,
    fontSize: '14px',
    color: 'gray',
  },
  menuRow: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  menuIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '4px',
  },
  menuText: {
    marginTop: '5px',
    fontSize: '12px',
    textAlign: 'center',
  },
  actionsSection: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButton: {
    margin: '10px 0',
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  usrInfo:{
    display:'flex',
    flexDirection:'column',
    height:'50px',
    textAlign:'left',
  }
};

export default UserDrawer;
