import { useState } from 'react';
import DesktopNavbar from '../components/patientComponents/DesktopNavbar';
import MobileNavbar from '../components/patientComponents/MobileNavbar';
import TreatmentsPage from './patientRoutes/TreatmentsPage';
import ConsultationsPage from './patientRoutes/ConsultationsPage';
import SettingsPage from './patientRoutes/SettingsPage';
import '../styles/patientDashboard/dashboard.scss';
import ChatList from './patientRoutes/ChatList';

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