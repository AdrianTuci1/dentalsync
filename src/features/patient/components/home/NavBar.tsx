import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { 
  HiOutlineHome, 
  HiOutlineUserGroup, 
  HiOutlineClipboardList, 
  HiOutlineUserCircle, 
  HiOutlineLogin 
} from "react-icons/hi";

const Navbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("home");
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
  const userRole = "admin"; // Simulated user role ("admin" = dashboard, "user" = history)

  // Detect screen width changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "home", icon: <HiOutlineHome />, label: "Acasa" },
    { id: "treatments", icon: <HiOutlineClipboardList />, label: "Tratamente" },
    { id: "medics", icon: <HiOutlineUserGroup />, label: "Medici" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarWrapper}>
      <div className={styles.menu}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItem} ${activeItem === item.id ? styles.active : ""}`}
            onClick={() => setActiveItem(item.id)}
          >
            {item.icon}
            {!isMobile && <span className={styles.label}>{item.label}</span>}
          </div>
        ))}

        {/* Separator */}
        <div className={styles.separator}></div>

        {/* User Role-Based Item (Fixed Size) */}
        <div className={`${styles.navItem} ${styles.fixedSize}`}>
          {userRole === "admin" ? <HiOutlineUserCircle /> : <HiOutlineClipboardList />}
        </div>

        {/* Sign In Button (Fixed Size) */}
        <div className={`${styles.navItem} ${styles.fixedSize}`}>
          <HiOutlineLogin />
        </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;