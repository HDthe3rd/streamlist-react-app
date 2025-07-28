// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { oauthService } from '../services/oauthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (oauthService.isAuthenticated()) {
        setIsAuthenticated(true);
        // You could fetch user info here
        setUser({ email: 'user@example.com' }); // Mock user data
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // For development/demo purposes, we'll simulate authentication
    if (process.env.NODE_ENV === 'development' || 
        !process.env.REACT_APP_OAUTH_CLIENT_ID || 
        process.env.REACT_APP_OAUTH_CLIENT_ID === 'your_oauth_client_id') {
      
      // Mock authentication for development
      console.log('Using mock authentication for development');
      localStorage.setItem('access_token', 'mock_token_' + Date.now());
      localStorage.setItem('token_expires_at', (Date.now() + 3600000).toString()); // 1 hour
      setIsAuthenticated(true);
      setUser({ email: 'demo@streamlist.com', name: 'Demo User' });
      return;
    }
    
    // Real OAuth flow
    window.location.href = oauthService.getAuthUrl();
  };

  const logout = () => {
    oauthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleOAuthCallback = async (urlParams) => {
    try {
      const code = oauthService.validateCallback(urlParams);
      await oauthService.exchangeCodeForToken(code);
      setIsAuthenticated(true);
      // Redirect to main app
      window.location.href = '/';
    } catch (error) {
      console.error('OAuth callback error:', error);
      // Handle error (show message, redirect to login, etc.)
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    handleOAuthCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};