import React, { useState, useEffect } from 'react';
import { Drawer, IconButton, Divider, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { logout, switchAccount } from '../services/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentService from '../services/fetchAppointments';
import styles from '../styles/drawers/UserDrawer.module.scss'; // Import the styles

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.auth.subaccountUser);
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const database = 'demo_db'; // Modify accordingly if needed

  const [todaysAppointments, setTodaysAppointments] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointmentService = new AppointmentService(token, database);
        const data = await appointmentService.fetchMedicAppointments(profile.id);
        setTodaysAppointments(data.today || []);
        setUpcomingAppointments(data.upcoming || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile.role === 'medic' && open) {
      fetchAppointments();
    }
  }, [open, profile, token]);

  const [selectedMenu, setSelectedMenu] = useState('today');

  const menuItems = [
    { key: 'today', label: 'Appointments for Today' },
    { key: 'upcoming', label: 'Upcoming Appointments' },
    { key: 'actions', label: 'Actions' },
  ];

  const handleLogOut = () => {
    dispatch(logout());
  };

  const handleSwitchAccount = () => {
    dispatch(switchAccount());
  };

  const renderAppointments = (appointments: any[]) => (
    <Box sx={{ p: 2 }}>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Box key={appointment.appointmentId} sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              {appointment.initialTreatment}
            </Typography>
            <Typography variant="body2">
              {appointment.date} at {appointment.time}
            </Typography>
            <Typography variant="body2">
              Patient: {appointment.patientUser.name}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))
      ) : (
        <Typography variant="body2">No appointments found.</Typography>
      )}
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className={styles.drawerContainer}>
        <div className={styles.drawerHeader}>
          {profile && (
            <div className={styles.drawerUserInfo}>
              <img
                src={profile.avatar || '/default-avatar.png'}
                alt="User Avatar"
                className={styles.drawerAvatar}
              />
              <div className={styles.usrInfo}>
                <p className={styles.drawerName}>{profile.name}</p>
                <p className={styles.drawerRole}>{profile.role}</p>
              </div>
            </div>
          )}
          <IconButton onClick={onClose} className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </div>

        <Divider />
        <div className={styles.menuRow}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={styles.menuItem}
              onClick={() => setSelectedMenu(item.key)}
            >
              <div
                className={styles.menuIcon}
                style={{
                  backgroundColor: selectedMenu === item.key ? 'black' : 'lightgray',
                }}
              />
              {selectedMenu === item.key && <p className={styles.menuText}>{item.label}</p>}
            </div>
          ))}
        </div>

        {selectedMenu === 'today' && renderAppointments(todaysAppointments)}
        {selectedMenu === 'upcoming' && renderAppointments(upcomingAppointments)}

        {selectedMenu === 'actions' && (
          <div className={styles.actionsSection}>
            <button className={styles.actionButton} onClick={handleLogOut}>
              Logout
            </button>
            <button className={styles.actionButton} onClick={handleSwitchAccount}>
              Switch Account
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default UserDrawer;
