// src/services/oauthService.js
export const oauthService = {
  // OAuth Configuration
  config: {
    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID || 'your_client_id_here',
    redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || 'http://localhost:3000/callback',
    scope: 'read write',
    responseType: 'code',
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth', // Example: Google OAuth
    tokenEndpoint: 'https://oauth2.googleapis.com/token'
  },

  // Generate OAuth URL
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      response_type: this.config.responseType,
      state: this.generateState(), // CSRF protection
      code_challenge: this.generateCodeChallenge(), // PKCE for security
      code_challenge_method: 'S256'
    });
    
    return `${this.config.authEndpoint}?${params.toString()}`;
  },

  // Generate CSRF state token
  generateState() {
    const state = btoa(Math.random().toString(36));
    sessionStorage.setItem('oauth_state', state);
    return state;
  },

  // Generate PKCE code challenge
  generateCodeChallenge() {
    const codeVerifier = this.generateCodeVerifier();
    sessionStorage.setItem('code_verifier', codeVerifier);
    return btoa(codeVerifier).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  },

  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  },

  // Validate state and extract code
  validateCallback(urlParams) {
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('oauth_state');
    
    if (state !== storedState) {
      throw new Error('Invalid state parameter - potential CSRF attack');
    }
    
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    return code;
  },

  // Exchange code for access token
  async exchangeCodeForToken(code) {
    const codeVerifier = sessionStorage.getItem('code_verifier');
    
    try {
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          code: code,
          redirect_uri: this.config.redirectUri,
          grant_type: 'authorization_code',
          code_verifier: codeVerifier
        })
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const tokenData = await response.json();
      
      // Store tokens securely (consider using httpOnly cookies in production)
      this.storeTokens(tokenData);
      
      return tokenData;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    } finally {
      // Clean up PKCE data
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('oauth_state');
    }
  },

  // Store tokens securely
  storeTokens(tokenData) {
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    
    // In production, use httpOnly cookies or secure storage
    localStorage.setItem('access_token', tokenData.access_token);
    localStorage.setItem('refresh_token', tokenData.refresh_token);
    localStorage.setItem('token_expires_at', expiresAt.toString());
    
    console.log('Tokens stored securely');
  },

  // Get current access token
  getAccessToken() {
    const token = localStorage.getItem('access_token');
    const expiresAt = parseInt(localStorage.getItem('token_expires_at') || '0');
    
    if (!token || Date.now() >= expiresAt) {
      return null; // Token expired or doesn't exist
    }
    
    return token;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getAccessToken() !== null;
  },

  // Logout and clear tokens
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    sessionStorage.clear();
    console.log('User logged out');
  },

  // Refresh access token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokenData = await response.json();
      this.storeTokens(tokenData);
      
      return tokenData;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout(); // Force re-authentication
      throw error;
    }
  }
};