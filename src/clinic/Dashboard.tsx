import { useState, useEffect, lazy } from "react";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
import "./styles/dashboard.scss";
import Stocks from "./routes/Stocks";
import Settings from "./routes/Settings";
import Medics from "./routes/Medics";
import Treatments from "./routes/Treatments";
import ChatComponent from "./routes/Chat";
import { WebSocketProvider } from "../shared/services/WebSocketContext";
import GlobalDrawer from "./components/drawers/GlobalDrawer";

// Lazy load content components
const HomePage = lazy(() => import("./routes/HomePage"));
const Appointments = lazy(() => import("./routes/Appointments"));
const Patients = lazy(() => import("./routes/Patients"));

function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const isMobile = window.innerWidth < 768;

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "patients":
        return <Patients />;
      case "appointments":
        return <Appointments />;
      case "medics":
        return <Medics />;
      case "treatments":
        return <Treatments />;
      case "stocks":
        return <Stocks />;
      case "chat":
        return <ChatComponent />;
      case "settings":
        return <Settings />;
      default:
        return <HomePage />;
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false); // Hide sidebar on small screens
      setIsSidebarOpen(false); // Reset to collapsed state
    } else {
      setIsSidebarVisible(true); // Show sidebar on larger screens
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="dashboard-page">
      <SideBar
        setActiveTab={setActiveTab}
        isSidebarVisible={isSidebarVisible}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
        setIsSidebarVisible={setIsSidebarVisible}
      />
          <div
            className={`dashboard-content ${
              !isSidebarVisible
                ? "full-width"
                : isSidebarOpen
                ? "with-sidebar-expanded"
                : "with-sidebar-collapsed"
            }`}
          >
          <NavBar activeTab={activeTab} />
          <div className="content-wrapper">
            <WebSocketProvider>{renderContent()}</WebSocketProvider>
          </div>
        </div>
        <GlobalDrawer />
      </div>
    </>
  );
}

export default Dashboard;


