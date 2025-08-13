import { useState } from 'react';
import { installPromptStyles, getButtonStyle } from '../styles/styles';

const InstallPrompt = ({ onInstall, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleInstall = async () => {
    setIsVisible(false);
    await onInstall();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleCloseHover = (e) => {
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  };

  const handleCloseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
  };

  if (!isVisible) return null;

  return (
    <div style={installPromptStyles.overlay}>
      <div style={installPromptStyles.prompt}>
        <div style={installPromptStyles.header}>
          <div style={installPromptStyles.icon}>📱</div>
          <h3 style={installPromptStyles.title}>Install EZTechMovie</h3>
          <button 
            style={installPromptStyles.closeButton}
            onClick={handleDismiss}
            onMouseEnter={handleCloseHover}
            onMouseLeave={handleCloseLeave}
            aria-label="Close install prompt"
          >
            ×
          </button>
        </div>
        
        <div style={installPromptStyles.content}>
          <p style={installPromptStyles.description}>
            Get the best experience with our mobile app! Install EZTechMovie 
            for faster loading, offline access, and exclusive features.
          </p>
          
          <div style={installPromptStyles.features}>
            <div style={installPromptStyles.feature}>
              <span style={{ fontSize: '1rem' }}>⚡</span>
              <span>Faster loading</span>
            </div>
            <div style={installPromptStyles.feature}>
              <span style={{ fontSize: '1rem' }}>📱</span>
              <span>Home screen access</span>
            </div>
            <div style={installPromptStyles.feature}>
              <span style={{ fontSize: '1rem' }}>🔄</span>
              <span>Offline browsing</span>
            </div>
            <div style={installPromptStyles.feature}>
              <span style={{ fontSize: '1rem' }}>🔔</span>
              <span>Push notifications</span>
            </div>
          </div>
        </div>
        
        <div style={installPromptStyles.actions}>
          <button 
            style={{...getButtonStyle('secondary'), flex: 1}}
            onClick={handleDismiss}
          >
            Maybe Later
          </button>
          <button 
            style={{...getButtonStyle('primary'), flex: 1, gap: '0.5rem'}}
            onClick={handleInstall}
          >
            <span style={{ fontSize: '1.125rem' }}>📲</span>
            Install App
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;