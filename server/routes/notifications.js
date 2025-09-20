// Push Notification Subscription Endpoint
// This would typically be added to your server routes

const express = require('express');
const webpush = require('web-push');

const router = express.Router();

// Configure VAPID keys (these should be environment variables in production)
const vapidKeys = {
  publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI0F8HwQJYN-QX4RP8EmX8g7C1cjwV_7uM60mcsS6nDz6kvF7G-9V3hzm0',
  privateKey: 'Your-Private-VAPID-Key-Here' // Replace with actual private key
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions (in production, use a database)
const subscriptions = new Map();

// Subscribe to push notifications
router.post('/subscribe', async (req, res) => {
  try {
    const subscription = req.body;
    const subscriptionId = subscription.endpoint;
    
    // Store subscription (in production, save to database)
    subscriptions.set(subscriptionId, subscription);
    
    console.log('New subscription:', subscriptionId);
    
    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    // Remove subscription (in production, remove from database)
    subscriptions.delete(endpoint);
    
    console.log('Subscription removed:', endpoint);
    
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error removing subscription:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Send notification to all subscribers
router.post('/send', async (req, res) => {
  try {
    const { title, body, data } = req.body;
    
    const notificationPayload = {
      notification: {
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: data || {}
      }
    };
    
    const promises = [];
    
    for (const [endpoint, subscription] of subscriptions) {
      promises.push(
        webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
          .catch(error => {
            console.error('Error sending notification to', endpoint, error);
            // Remove invalid subscriptions
            if (error.statusCode === 410) {
              subscriptions.delete(endpoint);
            }
          })
      );
    }
    
    await Promise.all(promises);
    
    res.status(200).json({ 
      message: `Notification sent to ${subscriptions.size} subscribers` 
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// Send appointment reminder
router.post('/appointment-reminder', async (req, res) => {
  try {
    const { appointmentId, patientId, doctorName, appointmentTime } = req.body;
    
    const notificationPayload = {
      notification: {
        title: 'Appointment Reminder',
        body: `You have an appointment with Dr. ${doctorName} at ${appointmentTime}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
          appointmentId,
          patientId,
          type: 'appointment_reminder'
        }
      }
    };
    
    // In production, you would filter subscriptions by patientId
    const promises = [];
    
    for (const [endpoint, subscription] of subscriptions) {
      promises.push(
        webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
          .catch(error => {
            console.error('Error sending appointment reminder to', endpoint, error);
            if (error.statusCode === 410) {
              subscriptions.delete(endpoint);
            }
          })
      );
    }
    
    await Promise.all(promises);
    
    res.status(200).json({ 
      message: 'Appointment reminder sent successfully' 
    });
  } catch (error) {
    console.error('Error sending appointment reminder:', error);
    res.status(500).json({ error: 'Failed to send appointment reminder' });
  }
});

module.exports = router;
