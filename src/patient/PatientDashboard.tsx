import { useState } from 'react';
import DesktopNavbar from './components/DesktopNavbar';
import MobileNavbar from './components/MobileNavbar';
import TreatmentsPage from './routes/TreatmentsPage';
import ConsultationsPage from './routes/ConsultationsPage';
import SettingsPage from './routes/SettingsPage';
import './styles/dashboard.scss';
import ChatList from './routes/ChatList';

function PatientDashboard() {
  const [activePage, setActivePage] = useState<string>('treatments');

  const renderPage = () => {
    switch (activePage) {
      case 'treatments':
        return <TreatmentsPage />;
      case 'consultations':
        return <ConsultationsPage />;
      case 'profile':
        return <ChatList />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <TreatmentsPage />;
    }
  };

  return (
    <div className="dashboard">
      <div className="dash__nav">
      <DesktopNavbar onSelect={setActivePage} activePage={activePage} />
      <MobileNavbar onSelect={setActivePage} activePage={activePage} />
      </div>
      <main className="dashboard__content">
        {renderPage()}
      </main>
    </div>
  );
}

export default PatientDashboard;