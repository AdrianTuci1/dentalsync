import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DesktopNavbar from './components/DesktopNavbar';
import HomePage from './routes/HomePage';
import TreatmentsPage from './routes/TreatmentsPage';
import MedicsPage from './routes/MedicsPage';
import ConsultationsPage from './routes/ConsultationsPage';
import SettingsPage from './routes/SettingsPage';
import './styles/dashboard.scss';

function PatientDashboard() {
  const authState = useSelector((state: any) => state.auth); // Access auth state
  const user = authState?.clinicUser; // Get authenticated user
  const [availablePages, setAvailablePages] = useState<string[]>(['home', 'treatments', 'medics']);
  const location = useLocation();

  useEffect(() => {
    if (user?.role === 'patient') {
      setAvailablePages((prev) => [...prev, 'consultations', 'settings']);
    } else if (user?.role === 'clinic') {
      setAvailablePages((prev) => [...prev, 'dashboard', 'settings']);
    }
  }, [user]);

  const activePage = location.pathname.replace('/', '') || 'home';

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="dash__nav">
        <DesktopNavbar activePage={activePage} availablePages={availablePages} />
      </div>

      {/* Content under Navbar */}
      <main className="dashboard__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/medics" element={<MedicsPage />} />
          {user?.role === 'patient' && (
            <Route path="/consultations" element={<ConsultationsPage />} />
          )}
          <Route path="/settings" element={<SettingsPage />} />
          {user?.role === 'clinic' && (
            <Route path="/dashboard" element={<div>Clinic Dashboard</div>} />
          )}
          {/* Redirect to home for unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default PatientDashboard;