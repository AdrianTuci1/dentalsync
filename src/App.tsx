import './styles/main.scss';
import { useState, useEffect } from 'react';
import SignIn from './routes/SignIn';
import Dashboard from './routes/Dashboard';

interface Profile {
  id: number;
  email: string;
  role: string;
}

function App() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Check localStorage for authentication on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('selectedProfile');
    if (savedProfile) {
      setSelectedProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    localStorage.setItem('selectedProfile', JSON.stringify(profile)); // Save the profile to localStorage
  };

  return (
    <div className="app">
      {selectedProfile ? (
        <Dashboard /> // Pass the profile to the dashboard
      ) : (
        <SignIn onProfileSelect={handleProfileSelect} /> // Pass the profile selection handler
      )}
    </div>
  );
}

export default App;
