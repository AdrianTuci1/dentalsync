import { useState, lazy } from 'react';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';
import '../styles/dashboard.scss';
import Stocks from './nested/Stocks';
import Settings from './nested/Settings';
import Medics from './nested/Medics';
import Treatments from './nested/Treatments';
import ChatComponent from './nested/Chat';
import { WebSocketProvider } from '../services/WebSocketContext';

// Lazy load content components
const HomePage = lazy(() => import('./nested/HomePage'));
const Appointments = lazy(() => import('./nested/Appointments'));
const Patients = lazy(() => import('./nested/Requests'));

function Dashboard() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'patients':
        return <Patients/>;
      case 'appointments':
        return <Appointments />;
      case 'medics':
        return <Medics />;
      case 'treatments':
        return <Treatments />;
      case 'stocks':
        return <Stocks />;
      case 'chat':
        return <ChatComponent />;
      case 'settings':
        return <Settings />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <div className="dashboard-page">
        {/* Vertical sidebar */}
        <div className="frame">
          <SideBar setActiveTab={setActiveTab} />
        </div>

        {/* Right column - navbar & other content */}
        <div className="dashboard-content">
          <NavBar activeTab={activeTab}/>

          {/* Content */}
          <div className="content-wrapper">
            <WebSocketProvider>
                {renderContent()}
            </WebSocketProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
