// Error Boundary Component - components/ErrorBoundary/ErrorBoundary.js
import React from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and external service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to external error reporting service (e.g., Sentry)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // In production, send to error reporting service
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId() // Implement based on your auth system
    };

    // Example: Send to Sentry, LogRocket, or your own error service
    console.log('Error Report:', errorReport);
    
    // For demo purposes, store in localStorage for later retrieval
    try {
      const existingErrors = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingErrors.push(errorReport);
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      localStorage.setItem('error_logs', JSON.stringify(existingErrors));
    } catch (storageError) {
      console.error('Failed to store error log:', storageError);
    }
  };

  getUserId = () => {
    // Return user ID from your auth system
    return localStorage.getItem('user_id') || 'anonymous';
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReportIssue = () => {
    const subject = encodeURIComponent(`Bug Report - Error ID: ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Please describe what you were doing when this error occurred:

[Your description here]
    `);
    
    window.open(`mailto:support@yourapp.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          ...styles.page,
          textAlign: 'center',
          padding: '4rem 2rem'
        }}>
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '2px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '12px',
            padding: '3rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              <Icons.Error />
            </div>
            
            <h2 style={{
              color: '#e53e3e',
              marginBottom: '1rem',
              fontSize: '1.8rem'
            }}>
              Oops! Something went wrong
            </h2>
            
            <p style={{
              color: '#718096',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              We're sorry, but an unexpected error occurred. This error has been 
              automatically reported to our team.
            </p>

            <p style={{
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#4a5568',
              marginBottom: '2rem'
            }}>
              Error ID: {this.state.errorId}
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleRetry}
                style={styles.button}
              >
                <Icons.Success />
                Try Again
              </button>
              
              <button
                onClick={this.handleReportIssue}
                style={styles.buttonSecondary}
              >
                <Icons.API />
                Report Issue
              </button>
              
              <button
                onClick={() => window.location.reload()}
                style={styles.deleteButton}
              >
                <Icons.Cancel />
                Reload Page
              </button>
            </div>

            {/* Development Mode Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '2rem',
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.05)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Development Error Details
                </summary>
                <pre style={{
                  marginTop: '1rem',
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: '300px'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Error Logger Utility
export const errorLogger = {
  // Log different types of errors
  logError: (error, context = {}) => {
    const errorLog = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      level: 'error',
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.error('Application Error:', errorLog);
    errorLogger.storeError(errorLog);
  },

  logWarning: (message, context = {}) => {
    const warningLog = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      message,
      timestamp: new Date().toISOString(),
      context,
      level: 'warning',
      url: window.location.href
    };

    console.warn('Application Warning:', warningLog);
    errorLogger.storeError(warningLog);
  },

  logInfo: (message, context = {}) => {
    const infoLog = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      message,
      timestamp: new Date().toISOString(),
      context,
      level: 'info',
      url: window.location.href
    };

    console.info('Application Info:', infoLog);
    // Don't store info logs to avoid clutter
  },

  storeError: (errorLog) => {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 100 logs
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Failed to store error log:', storageError);
    }
  },

  getLogs: () => {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  },

  clearLogs: () => {
    try {
      localStorage.removeItem('app_logs');
      console.log('Application logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  },

  // Export logs for debugging
  exportLogs: () => {
    const logs = errorLogger.getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `app-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Custom hook for error handling
export const useErrorHandler = () => {
  const handleError = (error, context = {}) => {
    errorLogger.logError(error, context);
  };

  const handleAsyncError = (asyncFunction, context = {}) => {
    return async (...args) => {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        handleError(error, { ...context, functionName: asyncFunction.name });
        throw error; // Re-throw so calling code can handle it
      }
    };
  };

  return { handleError, handleAsyncError };
};

// Performance Monitor Component
export const PerformanceMonitor = ({ children }) => {
  React.useEffect(() => {
    // Monitor performance metrics
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
            if (entry.duration > 1000) { // Log slow operations (>1s)
              errorLogger.logWarning('Slow performance detected', {
                entryType: entry.entryType,
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });

      return () => observer.disconnect();
    }
  }, []);

  return children;
};

export default ErrorBoundary;