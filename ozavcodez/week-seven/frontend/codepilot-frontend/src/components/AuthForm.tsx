import { useState } from 'react';
import * as api from '../services/api';

interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      let result;
      
      if (isRegistering) {
        result = await api.registerUser(email, password, name);
      } else {
        result = await api.loginUser(email, password);
      }

      if (result.success && result.data) {
        setMessage(isRegistering ? 'Registration successful!' : 'Login successful!');
        // Call the parent callback with the token
        onAuthSuccess(result.data.token);
      } else {
        setError(result.error || (isRegistering ? 'Registration failed' : 'Login failed'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <div>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegistering}
                disabled={loading}
              />
            </label>
          </div>
        )}
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
        </button>
        <button 
          type="button" 
          onClick={() => setIsRegistering(!isRegistering)}
          disabled={loading}
        >
          Switch to {isRegistering ? 'Login' : 'Register'}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      {error && <p className="auth-message error">{error}</p>}
    </div>
  );
}