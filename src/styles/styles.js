// Enhanced Modern Theme with Beautiful Colors and Gradients
export const theme = {
  colors: {
    // Modern gradient primary colors
    primary: '#667eea',
    primaryHover: '#5a67d8',
    primaryLight: '#a78bfa',
    primaryDark: '#4c51bf',
    
    // Beautiful accent colors
    secondary: '#ed64a6',
    secondaryHover: '#d53f8c',
    accent: '#38b2ac',
    accentHover: '#319795',
    
    // Success and status colors
    success: '#48bb78',
    successHover: '#38a169',
    successLight: '#68d391',
    warning: '#ed8936',
    warningHover: '#dd6b20',
    danger: '#f56565',
    dangerHover: '#e53e3e',
    
    // Modern neutral colors
    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f7fafc',
    backgroundTertiary: '#edf2f7',
    backgroundDark: '#1a202c',
    backgroundCard: 'rgba(255, 255, 255, 0.95)',
    backgroundGlass: 'rgba(255, 255, 255, 0.1)',
    
    // Text colors
    textPrimary: '#2d3748',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    textLight: '#a0aec0',
    textWhite: '#ffffff',
    
    // Border and divider colors
    borderLight: '#e2e8f0',
    borderMedium: '#cbd5e0',
    borderDark: '#a0aec0',
    
    // Gradient definitions
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #ed64a6 0%, #f093fb 100%)',
      success: 'linear-gradient(135deg, #48bb78 0%, #38d9a9 100%)',
      warning: 'linear-gradient(135deg, #ed8936 0%, #fbb040 100%)',
      danger: 'linear-gradient(135deg, #f56565 0%, #ff8a80 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      dark: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      sunset: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #42a5f5 100%)'
    }
  },
  
  spacing: {
    borderRadius: '12px',
    borderRadiusLarge: '16px',
    borderRadiusSmall: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionFast: 'all 0.15s ease',
    transitionSlow: 'all 0.5s ease'
  },
  
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
    md: '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
    colored: '0 8px 32px rgba(102, 126, 234, 0.25)',
    glow: '0 0 20px rgba(102, 126, 234, 0.3)',
    glass: '0 8px 32px rgba(31, 38, 135, 0.37)'
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem', 
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  }
};

// Modern App Styles with Proper Padding
export const appStyles = {
  app: {
    minHeight: '100vh',
    background: theme.colors.gradients.primary,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    overflow: 'hidden'
  },
  
  appContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem', // Increased padding for better spacing
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh'
  },
  
  main: {
    minHeight: 'calc(100vh - 140px)',
    background: theme.colors.backgroundCard,
    backdropFilter: 'blur(20px)',
    borderRadius: `${theme.spacing.borderRadiusLarge} ${theme.spacing.borderRadiusLarge} 0 0`,
    margin: '0 -2rem', // Match negative margin to container padding
    padding: '2.5rem 2rem', // Increased padding to prevent edge touching
    boxShadow: theme.shadows.glass,
    position: 'relative',
    overflow: 'hidden'
  },
  
  // Beautiful page layouts with proper spacing
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem', // Added horizontal padding to prevent edge contact
    position: 'relative'
  },
  
  pageTitle: {
    fontSize: theme.typography.fontSizes['3xl'],
    fontWeight: theme.typography.fontWeights.bold,
    background: theme.colors.gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '1rem',
    letterSpacing: '-0.025em'
  },
  
  pageSubtitle: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: '3rem',
    lineHeight: '1.6'
  },
  
  // Glass morphism card
  card: {
    background: theme.colors.backgroundCard,
    backdropFilter: 'blur(20px)',
    borderRadius: theme.spacing.borderRadius,
    boxShadow: theme.shadows.glass,
    border: `1px solid ${theme.colors.borderLight}`,
    padding: '2rem',
    transition: theme.spacing.transition,
    position: 'relative',
    overflow: 'hidden'
  },
  
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows.xl,
    borderColor: theme.colors.primary
  },
  
  // Loading states
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    flexDirection: 'column',
    gap: '1rem'
  },
  
  // Error states
  errorMessage: {
    background: theme.colors.gradients.danger,
    color: theme.colors.textWhite,
    padding: '1rem 1.5rem',
    borderRadius: theme.spacing.borderRadius,
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: theme.typography.fontWeights.medium
  }
};

// Production-Ready Navigation Styles
export const navbarStyles = {
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: theme.colors.textPrimary,
    padding: '1rem 0',
    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    transition: theme.spacing.transitionFast
  },
  
  navbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    gap: '2rem'
  },
  
  navbarBrand: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    margin: 0,
    background: theme.colors.gradients.primary,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: 'none',
    letterSpacing: '-0.025em',
    transition: theme.spacing.transition,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  navbarBrandHover: {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1)'
  },
  
  // Navigation menu
  navbarNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  
  navbarItem: {
    position: 'relative'
  },
  
  navbarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: theme.spacing.borderRadius,
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    transition: theme.spacing.transition,
    border: '1px solid transparent',
    background: 'transparent',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  
  navbarLinkActive: {
    color: theme.colors.primary,
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    fontWeight: theme.typography.fontWeights.semibold
  },
  
  navbarLinkHover: {
    color: theme.colors.primary,
    background: 'rgba(102, 126, 234, 0.05)',
    borderColor: 'rgba(102, 126, 234, 0.15)',
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows.sm
  },
  
  // Modern cart button
  navbarCart: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: theme.colors.gradients.primary,
    color: theme.colors.textWhite,
    padding: '0.75rem 1.25rem',
    borderRadius: theme.spacing.borderRadius,
    fontWeight: theme.typography.fontWeights.semibold,
    fontSize: theme.typography.fontSizes.sm,
    transition: theme.spacing.transition,
    position: 'relative',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    boxShadow: theme.shadows.sm,
    letterSpacing: '0.025em'
  },
  
  navbarCartHover: {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.glow,
    filter: 'brightness(1.1)'
  },
  
  // Cart badge
  cartCount: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: theme.colors.gradients.danger,
    color: theme.colors.textWhite,
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    minWidth: '22px',
    textAlign: 'center',
    lineHeight: '1',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: theme.shadows.sm
  },
  
  cartCountPulse: {
    animation: 'pulse 1.5s ease-in-out infinite'
  },
  
  // Mobile hamburger menu
  mobileMenuToggle: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    padding: '0.75rem',
    background: 'transparent',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing.borderRadiusSmall,
    cursor: 'pointer',
    transition: theme.spacing.transition,
    width: '44px',
    height: '44px',
    position: 'relative'
  },
  
  mobileMenuToggleHover: {
    background: 'rgba(102, 126, 234, 0.05)',
    borderColor: theme.colors.primary
  },
  
  mobileMenuLine: {
    width: '22px',
    height: '2px',
    background: theme.colors.textPrimary,
    borderRadius: '2px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'center'
  },
  
  // Hamburger animation states
  mobileMenuLineOpen1: {
    transform: 'rotate(45deg) translate(6px, 6px)'
  },
  
  mobileMenuLineOpen2: {
    opacity: 0,
    transform: 'scale(0)'
  },
  
  mobileMenuLineOpen3: {
    transform: 'rotate(-45deg) translate(6px, -6px)'
  },
  
  // Mobile menu dropdown
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: theme.shadows.xl,
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderTop: 'none',
    borderRadius: `0 0 ${theme.spacing.borderRadius} ${theme.spacing.borderRadius}`,
    padding: '1rem 0',
    zIndex: 999,
    transform: 'translateY(-10px)',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    maxHeight: '0',
    overflow: 'hidden'
  },
  
  mobileMenuVisible: {
    transform: 'translateY(0)',
    opacity: 1,
    visibility: 'visible',
    maxHeight: '400px'
  },
  
  mobileMenuItem: {
    display: 'flex',
    padding: '1rem 1.5rem',
    color: theme.colors.textPrimary,
    textDecoration: 'none',
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    transition: theme.spacing.transition,
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    alignItems: 'center',
    gap: '0.75rem',
    position: 'relative'
  },
  
  mobileMenuItemHover: {
    background: 'rgba(102, 126, 234, 0.05)',
    color: theme.colors.primary
  },
  
  mobileMenuItemActive: {
    background: 'rgba(102, 126, 234, 0.1)',
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
    borderLeft: `3px solid ${theme.colors.primary}`
  },
  
  // Mobile menu overlay
  mobileMenuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(2px)',
    zIndex: 998,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease'
  },
  
  mobileMenuOverlayVisible: {
    opacity: 1,
    visibility: 'visible'
  }
};

// Section Styles
export const sectionStyles = {
  section: {
    backgroundColor: theme.colors.backgroundWhite,
    margin: '2rem 0',
    padding: '2rem',
    borderRadius: theme.spacing.borderRadius,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.borderColor}`
  },
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    color: theme.colors.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }
};

// Modern Beautiful Button Styles
export const buttonStyles = {
  // Base button style
  button: {
    padding: '0.875rem 1.75rem',
    border: 'none',
    borderRadius: theme.spacing.borderRadius,
    cursor: 'pointer',
    fontWeight: theme.typography.fontWeights.semibold,
    fontSize: theme.typography.fontSizes.sm,
    transition: theme.spacing.transition,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: theme.shadows.sm,
    letterSpacing: '0.025em'
  },
  
  // Primary gradient button
  buttonPrimary: {
    background: theme.colors.gradients.primary,
    color: theme.colors.textWhite,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: theme.shadows.colored
  },
  
  buttonPrimaryHover: {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.glow,
    filter: 'brightness(1.1)'
  },
  
  // Secondary glass button
  buttonSecondary: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    color: theme.colors.textPrimary,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: theme.shadows.glass
  },
  
  buttonSecondaryHover: {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.md,
    borderColor: theme.colors.primary
  },
  
  // Success button
  buttonSuccess: {
    background: theme.colors.gradients.success,
    color: theme.colors.textWhite,
    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
  },
  
  buttonSuccessHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(72, 187, 120, 0.4)',
    filter: 'brightness(1.1)'
  },
  
  // Danger button
  buttonDanger: {
    background: theme.colors.gradients.danger,
    color: theme.colors.textWhite,
    boxShadow: '0 4px 12px rgba(245, 101, 101, 0.3)'
  },
  
  buttonDangerHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(245, 101, 101, 0.4)',
    filter: 'brightness(1.1)'
  },
  
  // Warning button  
  buttonWarning: {
    background: theme.colors.gradients.warning,
    color: theme.colors.textWhite,
    boxShadow: '0 4px 12px rgba(237, 137, 54, 0.3)'
  },
  
  buttonWarningHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(237, 137, 54, 0.4)',
    filter: 'brightness(1.1)'
  },
  
  // Small button variant
  buttonSmall: {
    padding: '0.5rem 1rem',
    fontSize: theme.typography.fontSizes.xs,
    borderRadius: theme.spacing.borderRadiusSmall
  },
  
  // Large button variant
  buttonLarge: {
    padding: '1.25rem 2.5rem',
    fontSize: theme.typography.fontSizes.lg,
    borderRadius: theme.spacing.borderRadiusLarge
  },
  
  // Disabled button state
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
    filter: 'none'
  },
  
  // Search button
  searchButton: {
    background: theme.colors.gradients.primary,
    color: theme.colors.textWhite,
    border: 'none',
    padding: '0.875rem 1.5rem',
    borderRadius: `0 ${theme.spacing.borderRadius} ${theme.spacing.borderRadius} 0`,
    cursor: 'pointer',
    fontWeight: theme.typography.fontWeights.semibold,
    transition: theme.spacing.transition,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: theme.shadows.colored
  },
  
  searchButtonHover: {
    filter: 'brightness(1.1)',
    boxShadow: theme.shadows.glow
  },
  
  // Enhanced Input styles with proper spacing
  input: {
    padding: '1rem 1.25rem',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing.borderRadius,
    background: theme.colors.backgroundPrimary,
    backdropFilter: 'blur(10px)',
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.sm,
    transition: theme.spacing.transition,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5',
    boxShadow: theme.shadows.sm,
    marginBottom: '1rem'
  },
  
  inputFocus: {
    borderColor: theme.colors.primary,
    boxShadow: `${theme.shadows.sm}, 0 0 0 3px rgba(102, 126, 234, 0.15)`,
    background: theme.colors.backgroundPrimary,
    transform: 'translateY(-1px)'
  },
  
  inputError: {
    borderColor: theme.colors.danger,
    boxShadow: `${theme.shadows.sm}, 0 0 0 3px rgba(245, 101, 101, 0.15)`
  },
  
  inputDisabled: {
    background: theme.colors.backgroundTertiary,
    color: theme.colors.textMuted,
    cursor: 'not-allowed',
    opacity: 0.7
  },
  
  // Enhanced Search container with proper spacing
  searchContainer: {
    display: 'flex',
    maxWidth: '600px',
    margin: '0 auto 2rem auto',
    boxShadow: theme.shadows.lg,
    borderRadius: theme.spacing.borderRadius,
    overflow: 'hidden',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    background: theme.colors.backgroundPrimary
  },
  
  searchInput: {
    flex: 1,
    padding: '1rem 1.25rem',
    border: 'none',
    background: 'transparent',
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.sm,
    outline: 'none',
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5'
  },
  
  searchInputFocus: {
    background: 'rgba(102, 126, 234, 0.02)'
  },
  
  // Form group with proper spacing
  formGroup: {
    marginBottom: '1.5rem',
    position: 'relative'
  },
  
  formGroupCompact: {
    marginBottom: '1rem'
  },
  
  formRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  
  formCol: {
    flex: 1
  },
  
  // Input with spacing for stacked inputs
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  
  inputStacked: {
    marginBottom: '0.75rem'
  },
  
  inputStackedLast: {
    marginBottom: '1.5rem'
  }
};

// Subscription List Styles
export const subscriptionStyles = {
  subscriptionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  
  subscriptionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: theme.colors.backgroundLight,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: theme.spacing.borderRadius,
    transition: theme.spacing.transition
  },
  
  subscriptionItemHover: {
    borderColor: theme.colors.primary,
    boxShadow: theme.shadows.md,
    transform: 'translateY(-1px)'
  },
  
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  
  itemName: {
    fontWeight: 600,
    color: theme.colors.textPrimary,
    fontSize: '1.125rem'
  },
  
  itemPrice: {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem'
  },
  
  itemType: {
    display: 'inline-block',
    padding: '0.125rem 0.5rem',
    backgroundColor: theme.colors.primary,
    color: 'white',
    fontSize: '0.75rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '0.5px'
  },
  
  itemTypeAccessory: {
    backgroundColor: theme.colors.success
  }
};

// Cart Styles
export const cartStyles = {
  cartContainer: {
    position: 'relative'
  },
  
  cartEmpty: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: theme.colors.textSecondary,
    fontSize: '1.125rem'
  },
  
  cartList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem',
    marginBottom: '1rem',
    backgroundColor: theme.colors.backgroundWhite,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: theme.spacing.borderRadius,
    boxShadow: theme.shadows.sm,
    transition: theme.spacing.transition
  },
  
  cartItemHover: {
    boxShadow: theme.shadows.md,
    borderColor: theme.colors.primary
  },
  
  cartItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1
  },
  
  cartItemName: {
    fontWeight: 600,
    color: theme.colors.textPrimary,
    fontSize: '1.125rem'
  },
  
  cartItemDetails: {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  
  cartItemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.spacing.borderRadius,
    padding: '0.25rem',
    border: `1px solid ${theme.colors.borderColor}`
  },
  
  quantityDisplay: {
    padding: '0.375rem 0.75rem',
    fontWeight: 600,
    minWidth: '40px',
    textAlign: 'center',
    color: theme.colors.textPrimary
  },
  
  cartTotal: {
    borderTop: `2px solid ${theme.colors.borderColor}`,
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
    textAlign: 'right'
  },
  
  cartTotalAmount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: theme.colors.primary,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.5rem'
  }
};

// PWA Install Prompt Styles
export const installPromptStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  
  prompt: {
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: theme.spacing.borderRadius,
    boxShadow: theme.shadows.lg,
    maxWidth: '400px',
    width: '100%',
    overflow: 'hidden',
    animation: 'slideInUp 0.3s ease-out'
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.success})`,
    color: 'white',
    position: 'relative'
  },
  
  icon: {
    fontSize: '2rem',
    marginRight: '1rem'
  },
  
  title: {
    margin: 0,
    flex: 1,
    fontSize: '1.25rem',
    fontWeight: 600
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.spacing.transition
  },
  
  content: {
    padding: '1.5rem'
  },
  
  description: {
    margin: '0 0 1.5rem 0',
    color: theme.colors.textSecondary,
    lineHeight: 1.5
  },
  
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: theme.colors.textPrimary
  },
  
  actions: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0 1.5rem 1.5rem 1.5rem'
  }
};

// Offline Indicator Styles
export const offlineIndicatorStyles = {
  indicator: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    zIndex: 999,
    boxShadow: theme.shadows.md,
    animation: 'slideInDown 0.3s ease-out'
  },
  
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative'
  },
  
  icon: {
    flexShrink: 0
  },
  
  pulse: {
    display: 'inline-block',
    animation: 'pulse 2s infinite'
  },
  
  text: {
    flex: 1
  },
  
  title: {
    margin: '0 0 0.25rem 0',
    fontSize: '1rem',
    fontWeight: 600
  },
  
  description: {
    margin: 0,
    fontSize: '0.875rem',
    opacity: 0.9,
    lineHeight: 1.4
  },
  
  features: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    whiteSpace: 'nowrap'
  },
  
  dismissButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.spacing.transition,
    position: 'absolute',
    top: '0.5rem',
    right: '1rem'
  }
};

// PWA Features Section Styles
export const pwaFeaturesStyles = {
  section: {
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  
  feature: {
    backgroundColor: theme.colors.backgroundWhite,
    padding: '1.5rem',
    borderRadius: theme.spacing.borderRadius,
    border: `1px solid ${theme.colors.borderColor}`,
    textAlign: 'center',
    transition: theme.spacing.transition
  },
  
  featureHover: {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.md,
    borderColor: theme.colors.primary
  },
  
  featureTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.125rem',
    color: theme.colors.textPrimary
  },
  
  featureDescription: {
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    lineHeight: 1.4
  }
};

// App Statistics Styles
export const statsStyles = {
  section: {
    backgroundColor: theme.colors.backgroundLight
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: theme.spacing.borderRadius,
    border: `1px solid ${theme.colors.borderColor}`
  },
  
  label: {
    fontWeight: 500,
    color: theme.colors.textSecondary,
    fontSize: '0.875rem'
  },
  
  value: {
    fontWeight: 600,
    color: theme.colors.textPrimary,
    fontSize: '0.875rem'
  },
  
  valueOnline: {
    color: theme.colors.success
  },
  
  valueOffline: {
    color: theme.colors.danger
  },
  
  valuePending: {
    color: theme.colors.warning
  },
  
  valueSynced: {
    color: theme.colors.success
  }
};

// Enhanced Responsive Styles with Hamburger Menu
export const responsiveStyles = {
  // Mobile breakpoint styles
  mobile: {
    // App container with proper mobile padding
    appContainer: {
      padding: '0 1rem' // Reduced but sufficient mobile padding
    },
    
    // Navbar mobile styles
    navbar: {
      padding: '0.75rem 0',
      position: 'relative' // Ensure mobile menu can overlay properly
    },
    
    navbarContainer: {
      padding: '0 1rem',
      gap: '1rem',
      position: 'relative'
    },
    
    navbarBrand: {
      fontSize: theme.typography.fontSizes.xl
    },
    
    // Hide desktop navigation on mobile
    navbarNav: {
      display: 'none'
    },
    
    // Show mobile menu toggle
    mobileMenuToggle: {
      display: 'flex'
    },
    
    // Simplified mobile cart
    navbarCart: {
      padding: '0.5rem 0.75rem',
      fontSize: theme.typography.fontSizes.xs
    },
    
    // Main content mobile styling
    main: {
      margin: '0 -1rem',
      borderRadius: `${theme.spacing.borderRadius} ${theme.spacing.borderRadius} 0 0`,
      padding: '2rem 1rem' // Proper mobile padding
    },
    
    // Page content mobile styling  
    page: {
      padding: '1.5rem 0.5rem' // Extra padding to prevent edge contact
    },
    
    pageTitle: {
      fontSize: theme.typography.fontSizes['2xl'],
      textAlign: 'center',
      marginBottom: '1.5rem'
    },
    
    pageSubtitle: {
      fontSize: theme.typography.fontSizes.base,
      marginBottom: '2rem'
    },
    
    // Section mobile spacing
    section: {
      margin: '1.5rem 0',
      padding: '1.5rem 1rem' // Ensure content doesn't touch edges
    },
    
    // Card mobile spacing
    card: {
      padding: '1.5rem',
      margin: '1rem 0'
    },
    
    subscriptionItem: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1rem'
    },
    
    cartItem: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1rem'
    },
    
    cartItemActions: {
      width: '100%',
      justifyContent: 'space-between'
    },
    
    cartTotalAmount: {
      justifyContent: 'center'
    }
  },
  
  smallMobile: {
    navbarContainer: {
      flexDirection: 'column',
      gap: '1rem'
    },
    
    section: {
      padding: '1rem'
    },
    
    btn: {
      width: '100%',
      justifyContent: 'center'
    },
    
    quantityControls: {
      width: '100%',
      justifyContent: 'center'
    }
  }
};

// CSS Media Query Helpers
export const mediaQueries = {
  // Apply mobile styles automatically
  mobile: '@media (max-width: 768px)',
  tablet: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
  
  // Mobile-first responsive navigation
  showMobileMenu: '@media (max-width: 768px)',
  hideMobileMenu: '@media (min-width: 769px)'
};

// Movie Grid and Card Styles
export const movieStyles = {
  moviesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    padding: '2rem 0'
  },
  
  movieCard: {
    background: theme.colors.backgroundCard,
    backdropFilter: 'blur(20px)',
    borderRadius: theme.spacing.borderRadiusLarge,
    boxShadow: theme.shadows.lg,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    transition: theme.spacing.transition,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '500px'
  },
  
  movieCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows.xl,
    borderColor: theme.colors.primary
  },
  
  moviePoster: {
    width: '100%',
    height: '300px',
    overflow: 'hidden',
    position: 'relative',
    background: `linear-gradient(135deg, ${theme.colors.backgroundTertiary} 0%, ${theme.colors.backgroundSecondary} 100%)`
  },
  
  movieTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    margin: '1rem 1.5rem 0.5rem 1.5rem',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  
  movieMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    margin: '0 1.5rem',
    alignItems: 'center'
  },
  
  movieDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: '1.5',
    margin: '1rem 1.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flex: 1
  },
  
  streamBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    background: theme.colors.gradients.primary,
    color: theme.colors.textWhite,
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  
  genreBadge: {
    background: theme.colors.gradients.secondary,
    color: theme.colors.textWhite
  },
  
  ratingBadge: {
    background: theme.colors.gradients.success,
    color: theme.colors.textWhite
  },
  
  streamItem: {
    background: theme.colors.backgroundCard,
    backdropFilter: 'blur(20px)',
    borderRadius: theme.spacing.borderRadius,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.5rem',
    margin: '1rem 0',
    boxShadow: theme.shadows.md,
    transition: theme.spacing.transition,
    position: 'relative'
  },
  
  streamItemHover: {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.lg,
    borderColor: theme.colors.primary
  },
  
  streamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  
  streamTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    flex: 1
  },
  
  streamList: {
    background: theme.colors.backgroundCard,
    backdropFilter: 'blur(20px)',
    borderRadius: theme.spacing.borderRadius,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    marginTop: '2rem',
    boxShadow: theme.shadows.lg,
    position: 'relative'
  },
  
  streamListHeader: {
    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
    paddingBottom: '1rem',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  
  streamListTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    margin: 0,
    background: theme.colors.gradients.primary,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  priorityBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  
  priorityHigh: {
    background: theme.colors.gradients.danger,
    color: theme.colors.textWhite
  },
  
  priorityMedium: {
    background: theme.colors.gradients.warning,
    color: theme.colors.textWhite
  },
  
  priorityLow: {
    background: theme.colors.gradients.success,
    color: theme.colors.textWhite
  },
  
  // Enhanced Form styles with proper spacing
  formGroup: {
    marginBottom: '1.5rem',
    position: 'relative'
  },
  
  label: {
    display: 'block',
    marginBottom: '0.75rem',
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textPrimary,
    letterSpacing: '0.025em'
  },
  
  textarea: {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing.borderRadius,
    background: theme.colors.backgroundPrimary,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.sm,
    transition: theme.spacing.transition,
    outline: 'none',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.6',
    boxShadow: theme.shadows.sm,
    marginBottom: '1rem'
  },
  
  textareaFocus: {
    borderColor: theme.colors.primary,
    boxShadow: `${theme.shadows.sm}, 0 0 0 3px rgba(102, 126, 234, 0.15)`,
    transform: 'translateY(-1px)'
  },
  
  select: {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing.borderRadius,
    background: theme.colors.backgroundPrimary,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.sm,
    transition: theme.spacing.transition,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily,
    boxShadow: theme.shadows.sm,
    marginBottom: '1rem',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '3rem'
  },
  
  selectFocus: {
    borderColor: theme.colors.primary,
    boxShadow: `${theme.shadows.sm}, 0 0 0 3px rgba(102, 126, 234, 0.15)`,
    transform: 'translateY(-1px)'
  }
};

// Utility Functions for Dynamic Styling
export const getButtonStyle = (variant = 'primary', size = 'normal', disabled = false) => {
  let baseStyle = { ...buttonStyles.button };
  
  if (disabled) {
    baseStyle = { ...baseStyle, ...buttonStyles.buttonDisabled };
  } else {
    switch (variant) {
      case 'primary':
        baseStyle = { ...baseStyle, ...buttonStyles.buttonPrimary };
        break;
      case 'danger':
        baseStyle = { ...baseStyle, ...buttonStyles.buttonDanger };
        break;
      case 'secondary':
        baseStyle = { ...baseStyle, ...buttonStyles.buttonSecondary };
        break;
      case 'success':
        baseStyle = { ...baseStyle, ...buttonStyles.buttonSuccess };
        break;
      default:
        baseStyle = { ...baseStyle, ...buttonStyles.buttonPrimary };
    }
  }
  
  if (size === 'small') {
    baseStyle = { ...baseStyle, ...buttonStyles.buttonSmall };
  } else if (size === 'large') {
    baseStyle = { ...baseStyle, ...buttonStyles.buttonLarge };
  }
  
  return baseStyle;
};

export const getStatValueStyle = (status) => {
  let baseStyle = { ...statsStyles.value };
  
  switch (status) {
    case 'online':
      return { ...baseStyle, ...statsStyles.valueOnline };
    case 'offline':
      return { ...baseStyle, ...statsStyles.valueOffline };
    case 'pending':
      return { ...baseStyle, ...statsStyles.valuePending };
    case 'synced':
      return { ...baseStyle, ...statsStyles.valueSynced };
    default:
      return baseStyle;
  }
};

// CSS Animations as JavaScript (for CSS-in-JS libraries)
export const animations = {
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `,
  
  slideInUp: `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  slideInDown: `
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
  `,
  
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  spin: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
};

// Create comprehensive styles object for component compatibility
export const styles = {
  // App-level styles
  ...appStyles,
  
  // Navigation styles
  ...navbarStyles,
  
  // Section and layout styles  
  ...sectionStyles,
  
  // Button styles
  ...buttonStyles,
  
  // Movie styles
  ...movieStyles,
  
  // Subscription styles
  ...subscriptionStyles,
  
  // Cart styles
  ...cartStyles,
  
  // Install prompt styles
  ...installPromptStyles,
  
  // Offline indicator styles
  ...offlineIndicatorStyles,
  
  // PWA features styles
  ...pwaFeaturesStyles,
  
  // Stats styles
  ...statsStyles,
  
  // Responsive styles
  ...responsiveStyles,
  
  // Animations
  ...animations,
  
  // Add theme and utility functions to styles object
  theme,
  getButtonStyle,
  getStatValueStyle
};

// Individual exports are already declared above with export const

// Export all styles as default
export default {
  theme,
  appStyles,
  navbarStyles,
  sectionStyles,
  buttonStyles,
  subscriptionStyles,
  cartStyles,
  installPromptStyles,
  offlineIndicatorStyles,
  pwaFeaturesStyles,
  statsStyles,
  responsiveStyles,
  animations,
  getButtonStyle,
  getStatValueStyle,
  styles
};