import React, { useState, useEffect, startTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clinicLoginSuccess, logout, subaccountLoginSuccess } from '../shared/services/authSlice';
import AuthService from '../shared/services/AuthService';
import { getSubdomain } from '../shared/utils/getSubdomains';
import './signin.scss';

interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  photo?: string;
}

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [pin, setPin] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicDbName, setClinicDbName] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);

  const getDatabaseName = (subdomain: string) => `${subdomain}_db`;

  useEffect(() => {
    const subdomain = getSubdomain();
    const dbName = getDatabaseName(subdomain);
    setClinicName(subdomain);
    setClinicDbName(dbName);

    if (authState.clinicUser && authState.subaccounts) {
      setProfiles(authState.subaccounts);
    }

    if (authState.subaccountUser) {
      setSelectedProfile(authState.subaccountUser);
    }
  }, [authState]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const authResult = await AuthService.login(email, password, clinicDbName);

      startTransition(() => {
        dispatch(
          clinicLoginSuccess({
            clinicToken: authResult.token,
            clinicUser: authResult.user,
            subaccounts: authResult.subaccounts,
          })
        );
        if (authResult.user.role === 'clinic') {
          setProfiles(authResult.subaccounts);
        } else {
          setSelectedProfile(authResult.user);
        }
      });
    } catch (err) {
      setError('Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubaccountLogin = async () => {
    if (!selectedProfile) return;

    setLoading(true);
    setError(null);

    try {
      const medicProfile = await AuthService.pinLogin(selectedProfile.id, pin, clinicDbName);

      startTransition(() => {
        dispatch(
          subaccountLoginSuccess({
            subaccountToken: medicProfile.token,
            subaccountUser: medicProfile.user,
          })
        );
      });
    } catch (err) {
      setError('Invalid PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelection = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleBackToProfiles = () => {
    setSelectedProfile(null);
    setPin('');
  };

  const handleBackToLogin = () => {
    dispatch(logout()); // Logs out the user and clears auth state
    setProfiles([]);
    setEmail('');
    setPassword('');
    setSelectedProfile(null);
  };

  return (
    <div className="signin-background">
      <div className="form-container">
        <div className="header-section">
          <div className="logo-container">
            <img src="" alt="Clinic Logo" className="clinic-logo" />
          </div>
          <h1 className="clinic-name">{clinicName}</h1>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        {loading && <p>Loading...</p>}
        
        {!selectedProfile && profiles.length === 0 && (
          <div className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <button onClick={handleLogin} disabled={loading || !email || !password} className="primary-button">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}

        {selectedProfile && profiles.length > 0 && (
          <div className="pin-entry-form">
            <button onClick={handleBackToProfiles} className="back-button">Back to Profiles</button>
            <h2 className="profile-header">Enter PIN for {selectedProfile.name}</h2>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input-field"
            />
            <button onClick={handleSubaccountLogin} disabled={loading || !pin} className="primary-button">
              {loading ? 'Verifying PIN...' : 'Access Subaccount'}
            </button>
          </div>
        )}

        {profiles.length > 0 && !selectedProfile && (
          <div className="profile-selection">
            <button onClick={handleBackToLogin} className="back-button">Back to Login</button>
            <h2 className="profile-header">Select a Profile</h2>
            <ul className="profile-list">
              {profiles.map((profile) => (
                <li key={profile.id} className="profile-item">
                  <button onClick={() => handleProfileSelection(profile)} className="profile-button">
                    {profile.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
