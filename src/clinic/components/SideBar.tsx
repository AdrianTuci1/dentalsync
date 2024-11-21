import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/navigation/sidebar.scss";

// Define the type for a button action
type ButtonAction = {
  id: string; // unique identifier for each button
  icon: string; // path to the icon image
  label: string; // label for the button
};

function SideBar({
  setActiveTab,
  isSidebarVisible,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile,
  setIsSidebarVisible,
}: {
  setActiveTab: (tab: string) => void;
  isSidebarVisible: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  setIsSidebarVisible: (visible: boolean) => void;
}) {
  const mainButtons: ButtonAction[] = [
    { id: "home", icon: "/dashboard.png", label: "Home" },
    { id: "appointments", icon: "/appointments.png", label: "Appointments" },
    { id: "patients", icon: "/requests.png", label: "Patients" },
    { id: "medics", icon: "/medics.png", label: "Medics" },
    { id: "treatments", icon: "/treatments.png", label: "Treatments" },
    { id: "stocks", icon: "/stocks.png", label: "Stocks" },
  ];

  const bottomButtons: ButtonAction[] = [
    { id: "settings", icon: "/settings.png", label: "Settings" },
  ];

  const getActiveButtonId = () => {
    return localStorage.getItem("activeButtonId") || mainButtons[0].id;
  };

  const [activeButtonId, setActiveButtonId] = useState<string>(getActiveButtonId());

  useEffect(() => {
    localStorage.setItem("activeButtonId", activeButtonId);
    setActiveTab(activeButtonId);
  }, [activeButtonId, setActiveTab]);

  const handleButtonClick = (id: string) => {
    setActiveButtonId(id);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible); // Toggle visibility for small screens
      setIsSidebarOpen(!isSidebarVisible); // Always open when visible
    } else {
      setIsSidebarOpen(!isSidebarOpen); // Toggle collapsed/expanded for large screens
    }
  };

  const sidebarContent = (
    <div
      className={`sidebar-frame ${
        !isSidebarVisible
          ? "hidden"
          : isSidebarOpen
          ? isMobile
            ? "expanded-full"
            : "expanded"
          : "collapsed"
      }`}
    >

      {/* Main Navigation Buttons */}
      <div className="frames">
        <div className="content-frame">
          {mainButtons.map((button) => (
            <button
              key={button.id}
              className={`menu-btn ${activeButtonId === button.id ? "active" : ""}`}
              onClick={() => handleButtonClick(button.id)}
            >
              <img src={button.icon} alt={`${button.id} icon`} className="btn-img" />
              {isSidebarOpen && <span className="btn-label">{button.label}</span>}
            </button>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="settings-frame">
          {bottomButtons.map((button) => (
            <button
              key={button.id}
              className={`menu-btn ${activeButtonId === button.id ? "active" : ""}`}
              onClick={() => handleButtonClick(button.id)}
            >
              <img src={button.icon} alt={`${button.id} icon`} className="btn-img" />
              {isSidebarOpen && <span className="btn-label">{button.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Render Sidebar in Portal */}
      {ReactDOM.createPortal(sidebarContent, document.body)}

      {/* Chevron */}
      <div
        className="chevron-toggle"
        onClick={toggleSidebar}
        style={{
          left: isMobile
            ? (!isSidebarVisible ? "15px" : "auto")
            : isSidebarVisible
            ? isSidebarOpen
              ? "240px"
              : "50px"
            : "10px",
          right: isMobile && isSidebarVisible ? "10px" : "auto",
        }}
      >
        <img
          src="/angle-small-right.png"
          alt="Toggle"
          style={{
            transform: isSidebarOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>
    </>
  );
}

export default SideBar;
