import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './routes/HomePage';
import TreatmentsPage from './routes/TreatmentsPage';
import MedicsPage from './routes/MedicsPage';
import ConsultationsPage from './routes/ConsultationsPage';
import SettingsPage from './routes/SettingsPage';
import './styles/dashboard.scss';
import './styles/fonts.css'
import Navbar from './components/Navbar';

function PatientDashboard() {
  const authState = useSelector((state: any) => state.auth); // Access auth state
  const user = authState?.clinicUser; // Get authenticated user

  

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="dash__nav">
        <Navbar />
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