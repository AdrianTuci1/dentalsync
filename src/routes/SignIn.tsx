import React, { useState, useEffect } from 'react';
import { getSubdomain } from '../utils/getSubdomains';
import { fetchDemoProfiles } from '../services/AuthService'; // Import the service function
import '../styles/signin.scss';

interface Profile {
  id: number;
  email: string;
  role: string;
}

interface SignInProps {
  onProfileSelect: (profile: Profile) => void; // Pass selected profile back to App.tsx
}

const SignIn: React.FC<SignInProps> = ({ onProfileSelect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isDemo, setIsDemo] = useState(false); // Flag for demo mode

  useEffect(() => {
    const subdomain = getSubdomain();
    if (subdomain) {
      setIsDemo(true);
      loadDemoProfiles();
    }
  }, []);

  // Function to load demo profiles using the service
  const loadDemoProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const demoProfiles = await fetchDemoProfiles();
      setProfiles(demoProfiles);
    } catch (err) {
      setError('An error occurred while loading profiles.');
    } finally {
      setLoading(false);
    }
  };

  // Function to select a profile
  const handleProfileSelection = (profile: Profile) => {
    onProfileSelect(profile); // Pass selected profile to App.tsx
  };

  return (
    <div className="signin-container">
      <h1>{isDemo ? '' : 'Clinic Login'}</h1>
      {error && <p className="signin-error">{error}</p>}

      {loading && <p>Loading profiles...</p>}

      {isDemo && profiles.length > 0 && (
        <div className="signin-profiles">
          <h2>Select a Profile</h2>
          <ul>
            {profiles.map((profile) => (
              <li key={profile.id}>
                <button onClick={() => handleProfileSelection(profile)}>
                  {profile.role} - {profile.email}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isDemo && (
        <div className="signin-form">
          {/* Add your regular clinic login form here */}
        </div>
      )}
    </div>
  );
};

export default SignIn;
