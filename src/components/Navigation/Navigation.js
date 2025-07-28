import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const Navigation = ({ currentPage, onPageChange }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'home', label: 'StreamList', icon: Icons.Home },
    { id: 'movies', label: 'Movies', icon: Icons.Movie },
    { id: 'cart', label: 'Cart', icon: Icons.Cart },
    { id: 'about', label: 'About', icon: Icons.About },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        <div 
          style={styles.logo}
          onClick={() => onPageChange('home')}
        >
          <Icons.Stream />
          StreamList Pro
        </div>
        
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              style={{
                ...styles.navLink,
                ...(currentPage === item.id ? styles.navLinkActive : {})
              }}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
          
          {/* User Info & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginLeft: '2rem',
            paddingLeft: '2rem',
            borderLeft: '1px solid rgba(74, 85, 104, 0.2)'
          }}>
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: '#4a5568'
              }}>
                <Icons.Check />
                <span>{user.email || 'Authenticated User'}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                ...styles.navLink,
                background: 'rgba(255, 107, 107, 0.1)',
                color: '#e53e3e',
                border: '1px solid rgba(255, 107, 107, 0.2)',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 107, 107, 0.2)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 107, 107, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Icons.Cancel />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;