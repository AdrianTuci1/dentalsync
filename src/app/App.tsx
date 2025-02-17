import './main.scss';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dashboard from '@/features/clinic/Dashboard';
import PatientDashboard from '@/features/patient/PatientDashboard';
import SignIn from './SignIn'; // Import the SignIn component
import { loadUserFromLocalStorage } from '@/api/slices/authSlice';
import { testValue } from '@/test';
import { getOfflineQueue } from "@/api/syncQueue";
import { setOfflineQueueCount } from "@/api/syncSlice";
import useSync from "@/api/hooks/useSync";
import DebugLocalForage from '@/features/clinic/DebugLocalForage';



function App() {
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);

  useSync(); 

  console.log(testValue);

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
    const checkQueue = async () => {
      const queue = await getOfflineQueue();
      dispatch(setOfflineQueueCount(queue.length));}
      checkQueue();
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

        <Route path="/debug" element={<DebugLocalForage />} />
      </Routes>
    </Router>
  );
}

export default App;