// src/components/Auth/LoginPage.js - Complete New File
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const LoginPage = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
      // Error will be handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      ...styles.app,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '3rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '450px',
        width: '100%',
        margin: '2rem',
        textAlign: 'center'
      }}>
        {/* App Logo/Icon */}
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <Icons.Stream />
        </div>
        
        {/* App Title */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          StreamList Pro
        </h1>
        
        {/* Welcome Message */}
        <p style={{ 
          color: '#718096', 
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Welcome to your personal streaming content manager. 
          Sign in securely to access your watchlist and discover new content.
        </p>

        {/* Security Features List */}
        <div style={{
          background: 'rgba(102, 126, 234, 0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#4a5568',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            textAlign: 'center'
          }}>
            <Icons.API /> Secure Authentication Features
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#718096',
            fontSize: '0.9rem'
          }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Check /> OAuth 2.0 with PKCE protection
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Check /> CSRF token validation
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Check /> Secure token storage
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Check /> Input sanitization & validation
            </li>
          </ul>
        </div>
        
        {/* Login Button */}
        <button 
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            ...styles.button,
            width: '100%',
            fontSize: '1.2rem',
            padding: '1.2rem 2rem',
            marginBottom: '1.5rem',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isLoading ? (
            <>
              <Icons.Loading />
              Connecting...
            </>
          ) : (
            <>
              <Icons.API />
              Sign In with OAuth
            </>
          )}
        </button>
        
        {/* Privacy Notice */}
        <p style={{ 
          fontSize: '0.8rem', 
          color: '#a0aec0',
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          By signing in, you agree to our secure authentication process. 
          Your data is protected with industry-standard security measures.
        </p>

        {/* Development Notice */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: '#856404'
            }}>
              <Icons.Construction /> <strong>Development Mode:</strong> OAuth will use mock authentication unless configured with real OAuth credentials.
            </p>
          </div>
        )}

        {/* Footer Links */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '0.9rem'
        }}>
          <a 
            href="mailto:support@streamlist.com"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            <Icons.API />
            Support
          </a>
          <span style={{ color: '#cbd5e0' }}>•</span>
          <a 
            href="#privacy"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            <Icons.About />
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;