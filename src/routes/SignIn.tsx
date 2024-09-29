import React, { useState, useEffect, startTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clinicLoginSuccess, subaccountLoginSuccess } from '../services/authSlice';
import AuthService from '../services/AuthService';
import { getSubdomain } from '../utils/getSubdomains';
import '../styles/signin.scss';

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
  const authState = useSelector((state: any) => state.auth); // Access global auth state

  const getDatabaseName = (subdomain: string) => `${subdomain}_db`;

  useEffect(() => {
    const subdomain = getSubdomain();
    const dbName = getDatabaseName(subdomain);
    setClinicName(subdomain);
    setClinicDbName(dbName);

    if (authState.clinicUser && authState.subaccounts) {
      setProfiles(authState.subaccounts); // Load subaccounts into profiles state
    }

    if (authState.subaccountUser) {
      setSelectedProfile(authState.subaccountUser); // Load selected subaccount
    }
  }, [authState]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const authResult = await AuthService.login(email, password, clinicDbName);

      // Using startTransition to avoid UI suspension
      startTransition(() => {
        dispatch(
          clinicLoginSuccess({
            clinicToken: authResult.token,
            clinicUser: authResult.user,
            subaccounts: authResult.subaccounts,
          })
        );
        if (authResult.user.role === 'clinic') {
          setProfiles(authResult.subaccounts); // Show subaccounts for clinic users
        } else {
          setSelectedProfile(authResult.user); // Directly proceed to dashboard
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

      // Using startTransition to avoid UI suspension
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

  return (
    <>
    <div className="top-part">
      <div className="logo-section">
        <img src="" alt=""/>
      </div>
      <h1>{clinicName}</h1>
    </div>
    <div className="signin-page">
    <div className="signin-container">
      {error && <p className="signin-error">{error}</p>}

      {loading && <p>Loading...</p>}
      {!selectedProfile && profiles.length === 0 && (
        <div className="signin-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} disabled={loading || !email || !password} className='btn-prim'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      )}

      {selectedProfile && profiles.length > 0 && (
        <div className="signin-subaccount">
          <h2>Enter PIN for {selectedProfile.name}</h2>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button onClick={handleSubaccountLogin} disabled={loading || !pin}>
            {loading ? 'Verifying PIN...' : 'Access Subaccount'}
          </button>
        </div>
      )}

      {profiles.length > 0 && !selectedProfile && (
        <div className="signin-profiles">
          <h2>Select a Profile</h2>
          <ul>
            {profiles.map((profile) => (
              <li key={profile.id}>
                <button onClick={() => handleProfileSelection(profile)}>
                  {profile.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default SignIn;
