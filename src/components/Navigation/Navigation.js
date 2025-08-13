// src/components/Navigation/Navigation.js - Enhanced with Cart Counter
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';
import { cartUtils } from '../../utils/cartUtils';

const Navigation = ({ currentPage, onPageChange, isOnline = true }) => {
  const { logout, user } = useAuth();
  const [cartStats, setCartStats] = useState(cartUtils.getCartStats());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update cart stats when component mounts or when storage changes
  useEffect(() => {
    const updateCartStats = () => {
      const stats = cartUtils.getCartStats();
      setCartStats(stats);
    };

    // Initial load
    updateCartStats();

    // Listen for storage changes (when cart is updated in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'streamlist_cart') {
        updateCartStats();
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      updateCartStats();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Update every 30 seconds to catch any missed updates
    const interval = setInterval(updateCartStats, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'StreamList', icon: Icons.Home },
    { id: 'movies', label: 'Movies', icon: Icons.Movie },
    { 
      id: 'cart', 
      label: 'Cart', 
      icon: Icons.Cart,
      badge: cartStats.totalQuantity > 0 ? cartStats.totalQuantity : null
    },
    { id: 'about', label: 'About', icon: Icons.About },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
    
    // Trigger cart stats update when navigating to cart
    if (pageId === 'cart') {
      const stats = cartUtils.getCartStats();
      setCartStats(stats);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('header')) {
        closeMobileMenu();
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  return (
    <header style={styles.navbar}>
      <div className="navbar-container" style={styles.navbarContainer}>
        <div 
          style={{
            ...styles.navbarBrand,
            cursor: 'pointer'
          }}
          onClick={() => handlePageChange('home')}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.navbarBrandHover)}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.filter = 'brightness(1)';
          }}
        >
          <Icons.Stream />
          <span>StreamList Pro</span>
          {!isOnline && (
            <span style={{
              fontSize: '0.7rem',
              background: 'rgba(255, 193, 7, 0.9)',
              color: '#ffffff',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              marginLeft: '0.5rem',
              fontWeight: 600
            }}>
              Offline
            </span>
          )}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="navbar-nav" style={styles.navbarNav}>
          {navItems.map((item) => (
            <div key={item.id} style={styles.navbarItem}>
              <button
                onClick={() => handlePageChange(item.id)}
                style={{
                  ...styles.navbarLink,
                  ...(currentPage === item.id ? styles.navbarLinkActive : {}),
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    Object.assign(e.target.style, styles.navbarLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.color = styles.navbarLink.color;
                    e.target.style.background = styles.navbarLink.background;
                    e.target.style.borderColor = styles.navbarLink.border;
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <item.icon />
                {item.label}
                
                {/* Cart Badge */}
                {item.badge && (
                  <span style={{
                    ...styles.cartCount,
                    ...(cartStats.totalQuantity > 0 ? styles.cartCountPulse : {})
                  }}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            </div>
          ))}
          
          {/* Cart & User Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Cart Value Display */}
            {cartStats.totalValue > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: styles.theme.colors.textSecondary,
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                <Icons.Cart />
                <span>{cartUtils.formatCurrency(cartStats.totalValue)}</span>
              </div>
            )}

            {/* User Info */}
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: styles.theme.colors.textSecondary
              }}>
                <Icons.Check style={{ color: styles.theme.colors.success }} />
                <span>{user.email || 'User'}</span>
              </div>
            )}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                ...styles.navbarLink,
                background: 'rgba(245, 101, 101, 0.1)',
                color: styles.theme.colors.danger,
                border: '1px solid rgba(245, 101, 101, 0.2)',
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
        
        {/* Mobile Hamburger Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          style={{
            ...styles.mobileMenuToggle,
            ...(isMobileMenuOpen ? styles.mobileMenuToggleHover : {})
          }}
          onClick={toggleMobileMenu}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.mobileMenuToggleHover)}
          onMouseLeave={(e) => {
            if (!isMobileMenuOpen) {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            }
          }}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div
            style={{
              ...styles.mobileMenuLine,
              ...(isMobileMenuOpen ? styles.mobileMenuLineOpen1 : {})
            }}
          />
          <div
            style={{
              ...styles.mobileMenuLine,
              ...(isMobileMenuOpen ? styles.mobileMenuLineOpen2 : {})
            }}
          />
          <div
            style={{
              ...styles.mobileMenuLine,
              ...(isMobileMenuOpen ? styles.mobileMenuLineOpen3 : {})
            }}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            ...styles.mobileMenuOverlay,
            ...(isMobileMenuOpen ? styles.mobileMenuOverlayVisible : {})
          }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Dropdown */}
      <div
        style={{
          ...styles.mobileMenu,
          ...(isMobileMenuOpen ? styles.mobileMenuVisible : {})
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePageChange(item.id)}
            style={{
              ...styles.mobileMenuItem,
              ...(currentPage === item.id ? styles.mobileMenuItemActive : {})
            }}
            onMouseEnter={(e) => {
              if (currentPage !== item.id) {
                Object.assign(e.target.style, styles.mobileMenuItemHover);
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== item.id) {
                e.target.style.background = 'transparent';
                e.target.style.color = styles.theme.colors.textPrimary;
              }
            }}
          >
            <item.icon />
            {item.label}
            {/* Mobile Cart Badge */}
            {item.badge && (
              <span style={{
                marginLeft: 'auto',
                background: styles.theme.colors.gradients.danger,
                color: styles.theme.colors.textWhite,
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: styles.theme.typography.fontSizes.xs,
                fontWeight: styles.theme.typography.fontWeights.bold
              }}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </button>
        ))}
        
        {/* Mobile Cart Value */}
        {cartStats.totalValue > 0 && (
          <div style={{
            ...styles.mobileMenuItem,
            cursor: 'default',
            borderBottom: 'none',
            justifyContent: 'center',
            background: 'rgba(102, 126, 234, 0.05)',
            fontWeight: styles.theme.typography.fontWeights.semibold,
            color: styles.theme.colors.primary
          }}>
            <Icons.Cart />
            Total: {cartUtils.formatCurrency(cartStats.totalValue)}
          </div>
        )}
        
        {/* Mobile User Info */}
        {user && (
          <div style={{
            ...styles.mobileMenuItem,
            cursor: 'default',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            fontSize: styles.theme.typography.fontSizes.sm,
            color: styles.theme.colors.textSecondary
          }}>
            <Icons.Check style={{ color: styles.theme.colors.success }} />
            {user.email || 'User'}
          </div>
        )}
        
        {/* Mobile Logout */}
        <button
          onClick={handleLogout}
          style={{
            ...styles.mobileMenuItem,
            color: styles.theme.colors.danger,
            borderBottom: 'none',
            fontWeight: styles.theme.typography.fontWeights.medium
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(245, 101, 101, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          <Icons.Cancel />
          Logout
        </button>
      </div>
      
      {/* Responsive CSS */}
      <style>{`
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .navbar-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
          .navbar-container {
            padding: 0 1rem !important;
          }
        }
        
        @media (min-width: 769px) {
          .navbar-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          .nav {
            flex-wrap: wrap;
          }
          
          .nav button {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Navigation;