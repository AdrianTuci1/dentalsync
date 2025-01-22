import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import SideBar from "@/components/navigation/SideBar";
import NavBar from "@/components/navigation/NavBar";
import "./styles/dashboard.scss";
import Stocks from "./routes/Stocks";
import Settings from "./routes/Settings";
import Medics from "./routes/Medics";
import Treatments from "./routes/Treatments";
import { WebSocketProvider } from "@/shared/services/WebSocketService";
import GlobalDrawer from "@/shared/components/Drawer";
import { debounce } from "lodash";
import { fetchAndCachePermissions, getPermissionsFromCookies } from "@/shared/services/permissionHelper";
import { useSelector } from "react-redux";
import { getSubdomain } from "@/shared/utils/getSubdomains";

// Lazy load content components
const HomePage = lazy(() => import("./routes/HomePage"));
const Appointments = lazy(() => import("./routes/Appointments"));
const Patients = lazy(() => import("./routes/Patients"));

function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<{ id: number; name: string }[]>([]); // State to hold permissions
  const isMobile = window.innerWidth < 768;

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const database = getSubdomain() + '_db'

  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
      setIsSidebarOpen(false);
    } else {
      setIsSidebarVisible(true);
    }
  }, []);

  useEffect(() => {
    const debouncedResize = debounce(handleResize, 200);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [handleResize]);

  // Fetch permissions on mount
  useEffect(() => {
    const loadPermissions = async () => {

      if (!token || !database) {
        console.error("Missing token or database for fetching permissions.");
        return;
      }

      const cachedPermissions = getPermissionsFromCookies();
      if (cachedPermissions.length > 0) {
        setPermissions(cachedPermissions); // Load cached permissions
      } else {
        try {
          const fetchedPermissions = await fetchAndCachePermissions(token, database);
          setPermissions(fetchedPermissions); // Update state with fetched permissions
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
      }
    };

    loadPermissions();
  }, []);

  // Check if a user has a specific permission
  //const hasPermission = (permissionName: string): boolean => {
  //  return permissions.some((permission) => permission.name === permissionName);
  //};

  const renderContent = () => (
    <Suspense fallback={<div>Loading...</div>}>
      {(() => {
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
          case "settings":
            return <Settings />;
          default:
            return <HomePage />;
        }
      })()}
    </Suspense>
  );

  return (
    <>
      {typeof isSidebarVisible !== "undefined" && (
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
      )}
    </>
  );
}

export default Dashboard;