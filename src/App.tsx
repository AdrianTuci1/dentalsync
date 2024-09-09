import './styles/main.scss';
import { useState, useEffect } from 'react';
import SignIn from './routes/SignIn';
import Dashboard from './routes/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for authentication on component mount
  useEffect(() => {
    const savedAuthState = localStorage.getItem('isAuthenticated');
    if (savedAuthState === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };


  return (
    <div className="app">
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <SignIn onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
