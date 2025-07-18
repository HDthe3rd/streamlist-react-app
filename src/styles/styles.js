// Enhanced Styles with better UX
export const styles = {
  // Global App Styles
  app: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#333',
  },
  
  // Header Styles
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#4a5568',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  
  // Navigation Styles
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  navLink: {
    color: '#4a5568',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    fontSize: '1rem',
  },
  
  navLinkActive: {
    background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    color: 'white',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
  },
  
  navLinkHover: {
    background: 'rgba(255, 107, 107, 0.1)',
    transform: 'translateY(-1px)',
  },
  
  // Main Content Styles
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    minHeight: 'calc(100vh - 200px)',
  },
  
  // Page Styles
  page: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
  },
  
  // Enhanced StreamList Form Styles
  streamForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '600px',
    margin: '0 auto 3rem auto',
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  label: {
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '1rem',
  },
  
  input: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    outline: 'none',
  },
  
  inputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-1px)',
  },
  
  textarea: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    outline: 'none',
  },
  
  select: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    outline: 'none',
    cursor: 'pointer',
  },
  
  button: {
    background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    outline: 'none',
  },
  
  buttonSecondary: {
    background: 'linear-gradient(135deg, #4299e1, #667eea)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  
  buttonSuccess: {
    background: 'linear-gradient(135deg, #48bb78, #38a169)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
  },
  
  // Enhanced Stream List Display Styles
  streamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  streamListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '0 0.5rem',
  },
  
  streamListTitle: {
    color: '#4a5568',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  
  streamListStats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.9rem',
    color: '#718096',
  },
  
  streamItem: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  
  streamItemCompleted: {
    background: 'rgba(72, 187, 120, 0.1)',
    border: '1px solid rgba(72, 187, 120, 0.3)',
  },
  
  streamItemEditing: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
  },
  
  streamItemHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
  
  streamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  
  streamTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '0.5rem',
    textDecoration: 'none',
  },
  
  streamTitleCompleted: {
    textDecoration: 'line-through',
    opacity: 0.7,
  },
  
  streamActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  
  streamMeta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
  },
  
  streamBadge: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  streamDescription: {
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  
  // Edit Form Styles
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(102, 126, 234, 0.2)',
  },
  
  editFormActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
  
  // Coming Soon Styles
  comingSoon: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  
  comingSoonIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  
  comingSoonTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: '1rem',
  },
  
  comingSoonText: {
    fontSize: '1.2rem',
    color: '#718096',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  
  // Footer Styles
  footer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '2rem 0',
    textAlign: 'center',
    color: '#718096',
    marginTop: '3rem',
  },
  
  deleteButton: {
    background: '#ff4757',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  // Notification/Toast Styles
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'linear-gradient(135deg, #48bb78, #38a169)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
    zIndex: 2000,
    animation: 'slideIn 0.3s ease',
  },
};