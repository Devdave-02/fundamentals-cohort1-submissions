import { useState } from 'react';
import AuthForm from './components/AuthForm';
import HealthCheck from './components/HealthCheck';
import ProductsList from './components/ProductsList';
import './App.css';

function App() {
  const [token, setToken] = useState<string>('');

  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
  };

  return (
    <>
      <div className="app-container">
        <h1>CodePilot API Tester</h1>
        
        {/* Authentication Section */}
        <AuthForm onAuthSuccess={handleAuthSuccess} />
        
        {/* Health Check */}
        <HealthCheck />
        
        {/* Products List */}
        <ProductsList token={token} />
      </div>
    </>
  );
}

export default App;