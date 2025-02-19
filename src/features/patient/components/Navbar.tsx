import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { 
  HiOutlineHome, 
  HiOutlineUserGroup, 
  HiOutlineClipboardList, 
  HiOutlineUserCircle, 
} from "react-icons/hi";
import { GoHistory } from "react-icons/go";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("home");
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

  // Get authenticated user from Redux store
  const authState = useSelector((state: any) => state.auth);
  const user = authState?.clinicUser;
  const isAuthenticated = !!user;
  const userRole = user?.role; // Can be "admin" or "patient"



  // Detect screen width changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define menu items
  const menuItems = [
    { id: "home", icon: <HiOutlineHome />, label: "Acasa", route: "/" },
    { id: "treatments", icon: <HiOutlineClipboardList />, label: "Tratamente", route: "/treatments" },
    { id: "medics", icon: <HiOutlineUserGroup />, label: "Medici", route: "/medics" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarWrapper}>
        <div className={styles.menu}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.navItem} ${activeItem === item.id ? styles.active : ""}`}
              onClick={() => {
                setActiveItem(item.id);
                navigate(item.route);
              }}
            >
              {item.icon}
              {!isMobile && <span className={styles.label}>{item.label}</span>}
            </div>
          ))}

          {/* Separator */}
          <div className={styles.separator}></div>

          {/* Role-Based Item (Only if authenticated) */}
          {isAuthenticated && (
            <div
              className={`${styles.navItem} ${styles.fixedSize}`}
              onClick={() => navigate(userRole === "clinic" ? "/dashboard" : "/consultations")}
            >
              {userRole === "clinic" ? <MdDashboard /> : <GoHistory />}
            </div>
          )}

          {/* Sign In/Settings Button */}
          <div
            className={`${styles.navItem} ${styles.fixedSize}`}
            onClick={() => navigate(isAuthenticated ? "/settings" : "/login")}
          >
            <HiOutlineUserCircle />
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;