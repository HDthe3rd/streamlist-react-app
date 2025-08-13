// src/App.js - Fixed version without duplicate InstallPrompt
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary, { PerformanceMonitor } from './components/ErrorBoundary/ErrorBoundary';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import StreamListPage from './components/StreamListPage/StreamListPage';
import MoviesPage from './components/MoviesPage/MoviesPage';
import CartPage from './components/CartPage/CartPage';
import AboutPage from './components/AboutPage/AboutPage';
import LoginPage from './components/Auth/LoginPage';
import OAuthCallback from './components/Auth/OAuthCallback';
import InstallPrompt from './components/InstallPrompt';
import { styles } from './styles/styles';


// Main App Content (requires authentication)
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('[PWA] Install prompt triggered');
      e.preventDefault();
      setInstallPrompt(e);
      
      // Show install prompt after 30 seconds if not installed
      setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('[PWA] Connection restored');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('[PWA] Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle shortcut navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shortcut = urlParams.get('shortcut');
    
    if (shortcut) {
      switch (shortcut) {
        case 'streams':
          setCurrentPage('home');
          break;
        case 'movies':
          setCurrentPage('movies');
          break;
        case 'cart':
          setCurrentPage('cart');
          break;
        default:
          break;
      }
    }
  }, []);

  const handleInstallApp = async () => {
    if (installPrompt) {
      try {
        const result = await installPrompt.prompt();
        console.log('[PWA] Install prompt result:', result);
        
        if (result.outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
        } else {
          console.log('[PWA] User dismissed the install prompt');
        }
        
        setInstallPrompt(null);
        setShowInstallPrompt(false);
      } catch (error) {
        console.error('[PWA] Install prompt failed:', error);
      }
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Loading StreamList Pro...</h2>
          <p style={{ color: '#718096' }}>Initializing your streaming experience</p>
        </div>
      </div>
    );
  }

  // Handle OAuth callback
  if (window.location.pathname === '/callback') {
    return <OAuthCallback />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        {showInstallPrompt && installPrompt && (
          <InstallPrompt
            onInstall={handleInstallApp}
            onDismiss={dismissInstallPrompt}
          />
        )}
      </>
    );
  }

  // Render main app for authenticated users
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <StreamListPage />;
      case 'movies':
        return <MoviesPage />;
      case 'cart':
        return <CartPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <StreamListPage />;
    }
  };

  return (
    <div style={styles.app}>
      {/* Offline Indicator */}
      {!isOnline && (
        <div style={{
          background: 'rgba(255, 193, 7, 0.9)',
          color: '#856404',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          📡 You're offline - Limited functionality available
        </div>
      )}
      
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isOnline={isOnline}
      />
      
      <main style={styles.main}>
        {renderPage()}
      </main>
      
      <Footer />

      {/* PWA Install Prompt */}
      {showInstallPrompt && installPrompt && (
        <InstallPrompt
          onInstall={handleInstallApp}
          onDismiss={dismissInstallPrompt}
        />
      )}
    </div>
  );
};

// Root App Component with all providers and PWA functionality
const App = () => {
  const [swRegistration, setSwRegistration] = useState(null);

  // Register Service Worker
  useEffect(() => {
    const registerSW = async () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        try {
          console.log('[PWA] Registering service worker...');
          
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none'
          });
          
          console.log('[PWA] Service Worker registered successfully:', registration);
          setSwRegistration(registration);

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            console.log('[PWA] Service Worker update found');
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New service worker installed');
                  // Show update notification
                  if (window.confirm('A new version of StreamList Pro is available. Reload to update?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });

          // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('[PWA] Message from service worker:', event.data);
          });

        } catch (error) {
          console.error('[PWA] Service Worker registration failed:', error);
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.log('[PWA] Service Worker skipped in development mode');
      }
    };

    registerSW();
  }, []);

  // Handle service worker updates
  useEffect(() => {
    if (swRegistration) {
      const handleControllerChange = () => {
        console.log('[PWA] Service Worker controller changed');
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      
      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, [swRegistration]);

  return (
    <ErrorBoundary>
      <PerformanceMonitor>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PerformanceMonitor>
    </ErrorBoundary>
  );
};

export default App;