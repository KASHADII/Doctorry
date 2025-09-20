// Push Notification Service
class PushNotificationService {
  constructor() {
    this.vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0F8HwQJYN-QX4RP8EmX8g7C1cjwV_7uM60mcsS6nDz6kvF7G-9V3hzm0';
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Subscribe to push notifications
  async subscribe() {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
    });

    // Send subscription to server
    await this.sendSubscriptionToServer(subscription);
    return subscription;
  }

  // Send subscription to server
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    if (!this.isSupported) {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('Unsubscribed from push notifications');
    }
  }

  // Check if user is subscribed
  async isSubscribed() {
    if (!this.isSupported) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  }

  // Send local notification
  async sendLocalNotification(title, options = {}) {
    if (!this.isSupported) {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options
    });
  }

  // Schedule appointment reminder
  async scheduleAppointmentReminder(appointment) {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();

    if (timeDiff > 0) {
      // Schedule reminder 1 hour before
      const reminderTime = timeDiff - (60 * 60 * 1000);
      
      if (reminderTime > 0) {
        setTimeout(() => {
          this.sendLocalNotification('Appointment Reminder', {
            body: `You have an appointment with Dr. ${appointment.doctorName} in 1 hour`,
            tag: `appointment-${appointment.id}`,
            data: { appointmentId: appointment.id }
          });
        }, reminderTime);
      }
    }
  }

  // Utility function to convert VAPID key
  urlBase64ToUint8Array(base64String) {
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
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
