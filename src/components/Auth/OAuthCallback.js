// src/components/Auth/OAuthCallback.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const OAuthCallback = () => {
  const { handleOAuthCallback } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for error in URL params
        const error = urlParams.get('error');
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        // Process the OAuth callback
        await handleOAuthCallback(urlParams);
        
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect to main app after a brief delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    processCallback();
  }, [handleOAuthCallback]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Icons.Loading />;
      case 'success':
        return <Icons.Success />;
      case 'error':
        return <Icons.Error />;
      default:
        return <Icons.Loading />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return '#667eea';
      case 'success':
        return '#48bb78';
      case 'error':
        return '#e53e3e';
      default:
        return '#667eea';
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '2rem',
          color: getStatusColor()
        }}>
          {getStatusIcon()}
        </div>
        
        <h2 style={{
          color: getStatusColor(),
          marginBottom: '1rem',
          fontSize: '1.8rem'
        }}>
          {status === 'processing' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>
        
        <p style={{
          color: '#718096',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          {message}
        </p>

        {status === 'processing' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#a0aec0',
            fontSize: '0.9rem'
          }}>
            <Icons.API />
            Verifying OAuth credentials...
          </div>
        )}

        {status === 'error' && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '2rem'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem',
              color: '#e53e3e'
            }}>
              If this problem persists, please check your OAuth configuration
              or contact support.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div style={{
            background: 'rgba(72, 187, 120, 0.1)',
            border: '1px solid rgba(72, 187, 120, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '2rem'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem',
              color: '#38a169'
            }}>
              <Icons.Check /> You will be redirected to your StreamList shortly...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;