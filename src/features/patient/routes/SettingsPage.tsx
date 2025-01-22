import { useState } from "react";
import "../styles/settingsPage.scss";
import YourProfile from "../components/settings/YourProfile";
import Files from "../components/settings/Files";
import DentalHistory from "../components/settings/DentalHistory";
import Settings from "../components/settings/Settings";
import HelpCenter from "../components/settings/HelpCenter";


const menuItems = [
  { label: "Your Profile", content: <YourProfile /> },
  { label: "Files", content: <Files /> },
  { label: "Dental History", content: <DentalHistory /> },
  { label: "Settings", content: <Settings /> },
  { label: "Help Center", content: <HelpCenter /> },
];

const SettingsPage = () => {
  const [activeItem, setActiveItem] = useState(0); // Tracks the active menu item index

  return (
    <div className="settings-page">
      {/* Sidebar Menu */}
      <div className="menu-sidebar">
        <h2 className="menu-title">Menu</h2>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${
                activeItem === index ? "active" : ""
              }`}
              onClick={() => setActiveItem(index)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        <h2 className="content-title">{menuItems[activeItem].label}</h2>
        <div className="content-box">{menuItems[activeItem].content}</div>
      </div>
    </div>
  );
};

export default SettingsPage;