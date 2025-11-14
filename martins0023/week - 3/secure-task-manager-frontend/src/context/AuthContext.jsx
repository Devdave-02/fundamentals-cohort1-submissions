import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh token on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.post('/auth/refresh-token');
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        setUser(response.data.user);
      } catch (error) {
        console.log('No valid refresh token found.');
        // No valid session
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user } = response.data;
    setAccessToken(accessToken);
    setUser(user);
    return response;
  };

  const register = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    const { user } = response.data;
    setUser(user);
    // After registration, we need to refresh to get the accessToken from the cookie
    const refreshResponse = await api.post('/auth/refresh-token');
    setAccessToken(refreshResponse.data.accessToken);
    return response;
  };
  
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);