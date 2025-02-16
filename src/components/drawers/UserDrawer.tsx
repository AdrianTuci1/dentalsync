import React, { useState, useEffect } from "react";
import {
  Divider,
  Box,
  Avatar,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EventIcon from "@mui/icons-material/Upcoming";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "@/components/drawerSlice";
import AppointmentService from "@/api/fetchAppointments";
import SmallAppointmentCard from "@/features/clinic/components/SmallAppointmentCard";
import styles from "@styles-cl/drawers/UserDrawer.module.scss";
import { logout, switchAccount } from "@/api/authSlice";
import { selectTopDrawer } from "@/shared/utils/selectors";
import { getSubdomain } from "@/shared/utils/getSubdomains";

const UserDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Get Redux state for the drawer
  const { isOpen, drawerType} = useSelector(selectTopDrawer);
  const profile = useSelector((state: any) => state.auth.subaccountUser);
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const database = getSubdomain() + "_db";

  
  // Local state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [personalNotes, setPersonalNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<"notes" | "upcoming" | "actions">("notes");

  const [offset, setOffset] = useState(0);
  const limit = 10;
  
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const appointmentService = new AppointmentService(token, database);
      const data = await appointmentService.fetchMedicAppointments(profile.id, limit, offset);
      setAppointments((prev) => [...prev, ...data.appointments]); // Append new results
      setOffset((prev) => prev + limit); // Increase offset for next request
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch appointments when drawer opens
  useEffect(() => {
    if (drawerType === "User" && isOpen) {
      fetchAppointments();
    }
  }, [isOpen, drawerType, profile, token]);

  const handleLogOut = () => {
    dispatch(logout());
  };

  const handleSwitchAccount = () => {
    dispatch(switchAccount());
  };

  const menuItems = [
    { key: "notes", icon: <EditNoteIcon fontSize="medium" /> },
    { key: "upcoming", icon: <EventIcon fontSize="medium" /> },
    { key: "actions", icon: <SettingsIcon fontSize="medium" /> },
  ];

  // Only render when `drawerType` matches 'User'
  if (drawerType !== "User") {
    return null;
  }

  return (
    <div className={styles.drawerContainer}>
      {/* Header */}
      <div className={styles.drawerHeader}>
        <div className={styles.drawerUserInfo}>
          <Avatar
            src={profile.avatar || "/avatar.png"}
            alt="User Avatar"
            sx={{ width: 40, height: 40 }}
          />
          <div className={styles.usrInfo}>
            <p className={styles.drawerName}>{profile.name}</p>
            <p className={styles.drawerRole}>{profile.role}</p>
          </div>
        </div>
        <IconButton onClick={() => dispatch(closeDrawer())} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
      </div>

      <Divider />

      {/* Menu Row */}
      <div className={styles.menuRow}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`${styles.menuItem} ${
              selectedMenu === item.key ? styles.activeMenuItem : ""
            }`}
            onClick={() => setSelectedMenu(item.key as "upcoming" | "notes" | "actions")}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Content Based on Menu */}
      {selectedMenu === "upcoming" && (
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : appointments.length > 0 ? (
            <>
            {appointments.map((appointment) => (
              <SmallAppointmentCard
                key={appointment.appointmentId}
                role="medic"
                appointment={appointment}
              />))}
              <button className={styles.loadMoreButton} onClick={() => fetchAppointments()}>
              Load More
            </button>
            </>
          ) : (
            <Typography>No upcoming appointments.</Typography>
          )}
        </Box>
      )}

      {selectedMenu === "notes" && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Personal Notes
          </Typography>
          <TextField
            multiline
            rows={8}
            fullWidth
            placeholder="Write your notes here..."
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            variant="outlined"
          />
        </Box>
      )}

      {selectedMenu === "actions" && (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <button className={styles.actionButton} onClick={handleLogOut}>
            Logout
          </button>
          <button className={styles.actionButton} onClick={handleSwitchAccount}>
            Switch Account
          </button>
        </Box>
      )}
    </div>
  );
};

export default UserDrawer;
