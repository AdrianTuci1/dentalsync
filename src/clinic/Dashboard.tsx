import { useState, lazy } from 'react';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import './styles/dashboard.scss';
import Stocks from './routes/Stocks';
import Settings from './routes/Settings';
import Medics from './routes/Medics';
import Treatments from './routes/Treatments';
import ChatComponent from './routes/Chat';
import { WebSocketProvider } from '../shared/services/WebSocketContext';

// Lazy load content components
const HomePage = lazy(() => import('./routes/HomePage'));
const Appointments = lazy(() => import('./routes/Appointments'));
const Patients = lazy(() => import('./routes/Requests'));

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
