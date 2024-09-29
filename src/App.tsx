import './styles/main.scss';
import { useEffect } from 'react';
import SignIn from './routes/SignIn';
import Dashboard from './routes/Dashboard';
import PatientDashboard from './routes/PatientDashboard';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserFromLocalStorage } from './services/authSlice';

function App() {
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth); // Access global auth state

  // Load user data from localStorage on mount
  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  // Render the correct dashboard based on user role
  if (!authState.clinicUser) {
    return <SignIn />;
  } else if (authState.subaccountUser) {
    return <Dashboard />; // Medic/Admin users
  } else if (authState.clinicUser.role === 'clinic') {
    return <SignIn />; // Clinic role needs to select subaccount and enter PIN
  } else if (authState.clinicUser.role === 'patient') {
    return <PatientDashboard />; // Render Patient Dashboard
  }

  return <div>Loading...</div>;
}

export default App;
