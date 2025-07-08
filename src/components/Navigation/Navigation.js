import React from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const Navigation = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', label: 'StreamList', icon: Icons.Home },
    { id: 'movies', label: 'Movies', icon: Icons.Movie },
    { id: 'cart', label: 'Cart', icon: Icons.Cart },
    { id: 'about', label: 'About', icon: Icons.About },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        <div 
          style={styles.logo}
          onClick={() => onPageChange('home')}
        >
          <Icons.Stream />
          StreamList
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
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  Object.assign(e.target.style, styles.navLinkHover);
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;