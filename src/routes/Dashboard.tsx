import { useState, lazy } from 'react';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';
import '../styles/dashboard.scss';
import Stocks from './nested/Stocks';
import Payments from './nested/Payments';
import Help from './nested/Help';
import Settings from './nested/Settings';

// Lazy load content components
const Stats = lazy(() => import('./nested/Stats'));
const Appointments = lazy(() => import('./nested/Appointments'));
const Requests = lazy(() => import('./nested/Requests'));

function Dashboard() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <Stats />;
      case 'requests':
        return <Requests />;
      case 'appointments':
        return <Appointments />;
      case 'stocks':
        return <Stocks />;
      case 'payments':
        return <Payments />;
      case 'help':
        return <Help />;
      case 'settings':
        return <Settings />;
      default:
        return <Stats />;
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
                {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
