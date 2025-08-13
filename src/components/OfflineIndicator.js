import { useState, useEffect } from 'react';
import { offlineIndicatorStyles } from '../styles/styles';

const OfflineIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    // Allow dismissal after 5 seconds
    const timer = setTimeout(() => {
      setCanDismiss(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    if (canDismiss) {
      setIsVisible(false);
    }
  };

  const handleDismissHover = (e) => {
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  };

  const handleDismissLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
  };

  if (!isVisible) return null;

  return (
    <div style={offlineIndicatorStyles.indicator}>
      <div style={offlineIndicatorStyles.content}>
        <div style={offlineIndicatorStyles.icon}>
          <span style={offlineIndicatorStyles.pulse}>🔴</span>
        </div>
        
        <div style={offlineIndicatorStyles.text}>
          <h4 style={offlineIndicatorStyles.title}>You're Offline</h4>
          <p style={offlineIndicatorStyles.description}>
            No internet connection detected. You can still browse your cart 
            and manage items. Changes will sync when you're back online.
          </p>
        </div>
        
        <div style={offlineIndicatorStyles.features}>
          <div style={offlineIndicatorStyles.feature}>
            <span style={{ fontSize: '1rem' }}>✅</span>
            <span>View cart items</span>
          </div>
          <div style={offlineIndicatorStyles.feature}>
            <span style={{ fontSize: '1rem' }}>✅</span>
            <span>Modify quantities</span>
          </div>
          <div style={offlineIndicatorStyles.feature}>
            <span style={{ fontSize: '1rem' }}>⏳</span>
            <span>Auto-sync when online</span>
          </div>
        </div>
        
        {canDismiss && (
          <button 
            style={offlineIndicatorStyles.dismissButton}
            onClick={handleDismiss}
            onMouseEnter={handleDismissHover}
            onMouseLeave={handleDismissLeave}
            aria-label="Dismiss offline notification"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Add the pulse animation styles directly */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default OfflineIndicator;