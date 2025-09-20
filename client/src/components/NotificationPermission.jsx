import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import pushNotificationService from '../services/pushNotificationService';

const NotificationPermission = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    if (!pushNotificationService.isSupported) {
      return;
    }

    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    if (currentPermission === 'granted') {
      const subscribed = await pushNotificationService.isSubscribed();
      setIsSubscribed(subscribed);
      
      // Show prompt if not subscribed and permission is granted
      if (!subscribed) {
        setShowPrompt(true);
      }
    } else if (currentPermission === 'default') {
      // Show prompt for first-time users
      setShowPrompt(true);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const granted = await pushNotificationService.requestPermission();
      
      if (granted) {
        await pushNotificationService.subscribe();
        setIsSubscribed(true);
        setPermission('granted');
        setShowPrompt(false);
        
        // Show success message
        showNotificationMessage(t('pwa.notifications.permission_granted'), 'success');
      } else {
        setPermission('denied');
        setShowPrompt(false);
        showNotificationMessage(t('pwa.notifications.permission_denied'), 'error');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      showNotificationMessage('Failed to enable notifications', 'error');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal to avoid showing again immediately
    localStorage.setItem('notification-permission-dismissed', Date.now().toString());
  };

  const showNotificationMessage = (message, type) => {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Don't show if notifications are not supported or already handled
  if (!pushNotificationService.isSupported || !showPrompt) {
    return null;
  }

  // Check if recently dismissed
  const recentlyDismissed = localStorage.getItem('notification-permission-dismissed');
  if (recentlyDismissed && Date.now() - parseInt(recentlyDismissed) < 24 * 60 * 60 * 1000) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12 7H4.828z" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('pwa.notifications.permission_required')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Enable notifications to receive appointment reminders and updates.
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleRequestPermission}
                className="bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
              >
                Enable
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 text-sm font-medium px-3 py-1.5 rounded-md hover:text-gray-700 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;
