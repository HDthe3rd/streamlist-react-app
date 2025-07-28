// src/App.js - Complete Modified Version
import React, { useState } from 'react';
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
import { styles } from './styles/styles';

// Main App Content (requires authentication)
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Loading StreamList...</h2>
          <p style={{ color: '#718096' }}>Checking your authentication status</p>
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
    return <LoginPage />;
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
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main style={styles.main}>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

// Root App Component with all providers
const App = () => {
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
