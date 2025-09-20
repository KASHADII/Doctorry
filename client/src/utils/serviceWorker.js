// Service Worker Registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              showUpdateNotification();
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  } else {
    console.log('Service Worker not supported');
  }
};

// Show update notification
const showUpdateNotification = () => {
  if (confirm('A new version of Doctorry is available. Would you like to update?')) {
    window.location.reload();
  }
};

// Handle service worker messages
export const handleServiceWorkerMessages = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from service worker:', event.data);
      
      // Handle different message types
      switch (event.data.type) {
        case 'CACHE_UPDATED':
          console.log('Cache updated');
          break;
        case 'OFFLINE_ACTION_QUEUED':
          console.log('Action queued for when online');
          break;
        default:
          console.log('Unknown message type:', event.data.type);
      }
    });
  }
};

// Check for updates
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }
};

// Unregister service worker (for development)
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
      console.log('Service Worker unregistered');
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
    }
  }
};
