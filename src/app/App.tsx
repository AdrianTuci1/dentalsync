import './main.scss';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dashboard from '../clinic/Dashboard';
import PatientDashboard from '../patient/PatientDashboard';
import SignIn from './SignIn'; // Import the SignIn component
import { loadUserFromLocalStorage } from '../shared/services/authSlice';

function App() {
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  // Extract necessary state
  const { clinicUser, subaccountUser } = authState;

  const isAuthenticated = !!clinicUser;
  const isClinicRole = clinicUser?.role === 'clinic';
  const hasSelectedSubaccount = !!subaccountUser;

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              isClinicRole && !hasSelectedSubaccount ? (
                <SignIn /> // Clinic role needs to select subaccount and enter PIN
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <SignIn />
            )
          }
        />

        {/* Main Website (Accessible to Everyone) */}
        <Route
          path="*"
          element={<PatientDashboard />}
        />

        {/* Clinic Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated && isClinicRole && hasSelectedSubaccount ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;