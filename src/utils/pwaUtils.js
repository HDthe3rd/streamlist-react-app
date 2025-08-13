// PWA Utility Functions for EZTechMovie
// Handles service worker registration, installation prompts, and PWA features

/**
 * Register the service worker
 * @returns {Promise} - Service worker registration promise
 */
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', registration);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              showUpdateAvailableNotification();
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_VERSION') {
          console.log('Service Worker version:', event.data.version);
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    console.warn('Service Workers are not supported in this browser');
    return null;
  }
};

/**
 * Check if the app can be installed as PWA
 * @returns {boolean} - True if installation is supported
 */
export const canInstallPWA = () => {
  return 'beforeinstallprompt' in window;
};

/**
 * Handle PWA installation prompt
 * @returns {Promise<boolean>} - True if user accepted installation
 */
export const handlePWAInstall = (() => {
  let deferredPrompt = null;

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (event) => {
    console.log('PWA install prompt triggered');
    
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    
    // Save the event so it can be triggered later
    deferredPrompt = event;
    
    // Show custom install button
    showInstallButton();
  });

  // Listen for successful app installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed successfully');
    hideInstallButton();
    
    // Track installation event (could send to analytics)
    trackPWAInstallation();
  });

  return async () => {
    if (!deferredPrompt) {
      console.log('No installation prompt available');
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA install prompt outcome:', outcome);

      // Clear the deferredPrompt
      deferredPrompt = null;
      hideInstallButton();

      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  };
})();

/**
 * Check if the app is running as an installed PWA
 * @returns {boolean} - True if running as PWA
 */
export const isRunningAsPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
};

/**
 * Check if the app is running offline
 * @returns {boolean} - True if offline
 */
export const isOffline = () => {
  return !navigator.onLine;
};

/**
 * Set up offline/online event listeners
 * @param {Function} onOnline - Callback for when app goes online
 * @param {Function} onOffline - Callback for when app goes offline
 */
export const setupNetworkListeners = (onOnline, onOffline) => {
  window.addEventListener('online', () => {
    console.log('App is now online');
    if (onOnline) onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('App is now offline');
    if (onOffline) onOffline();
  });
};

/**
 * Request permission for push notifications
 * @returns {Promise<boolean>} - True if permission granted
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('Notification permission was denied');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

/**
 * Subscribe to push notifications
 * @param {ServiceWorkerRegistration} registration - SW registration
 * @returns {Promise<PushSubscription>} - Push subscription
 */
export const subscribeToPushNotifications = async (registration) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(getVapidPublicKey())
    });

    console.log('Push notification subscription created:', subscription);
    
    // Send subscription to server
    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    throw error;
  }
};

/**
 * Background sync for cart data
 * @param {any} cartData - Cart data to sync
 * @returns {Promise} - Sync promise
 */
export const syncCartData = async (cartData) => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Store cart data for sync
      await storeCartDataForSync(cartData);
      
      // Register background sync
      await registration.sync.register('cart-sync');
      
      console.log('Cart data queued for background sync');
    } catch (error) {
      console.error('Background sync registration failed:', error);
      
      // Fallback: try immediate sync
      await syncCartDataImmediately(cartData);
    }
  } else {
    // Fallback for browsers without background sync
    await syncCartDataImmediately(cartData);
  }
};

/**
 * Get PWA display mode
 * @returns {string} - Display mode (standalone, fullscreen, minimal-ui, browser)
 */
export const getPWADisplayMode = () => {
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }
  return 'browser';
};

// Helper Functions

/**
 * Show update available notification
 */
const showUpdateAvailableNotification = () => {
  // Could show a banner or toast notification
  console.log('New app version available! Please refresh.');
  
  // Create custom notification element
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; background: #2563eb; color: white; padding: 1rem; text-align: center; z-index: 9999;">
      <span>New version available!</span>
      <button onclick="window.location.reload()" style="margin-left: 1rem; background: white; color: #2563eb; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
        Update Now
      </button>
    </div>
  `;
  document.body.appendChild(notification);
};

/**
 * Show install button
 */
const showInstallButton = () => {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
};

/**
 * Hide install button
 */
const hideInstallButton = () => {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
};

/**
 * Track PWA installation for analytics
 */
const trackPWAInstallation = () => {
  // Could send to Google Analytics or other tracking service
  console.log('PWA installation tracked');
};

/**
 * Convert VAPID key for push notifications
 * @param {string} base64String - Base64 encoded key
 * @returns {Uint8Array} - Converted key
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/**
 * Get VAPID public key (would be provided by your push service)
 * @returns {string} - VAPID public key
 */
const getVapidPublicKey = () => {
  // Replace with your actual VAPID public key
  return 'your-vapid-public-key-here';
};

/**
 * Send subscription to server
 * @param {PushSubscription} subscription - Push subscription
 */
const sendSubscriptionToServer = async (subscription) => {
  try {
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    });
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
  }
};

/**
 * Store cart data for background sync
 * @param {any} cartData - Cart data to store
 */
const storeCartDataForSync = async (cartData) => {
  // Implementation would use IndexedDB
  console.log('Cart data stored for sync:', cartData);
};

/**
 * Sync cart data immediately
 * @param {any} cartData - Cart data to sync
 */
const syncCartDataImmediately = async (cartData) => {
  try {
    await fetch('/api/cart/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData)
    });
  } catch (error) {
    console.error('Immediate cart sync failed:', error);
  }
};