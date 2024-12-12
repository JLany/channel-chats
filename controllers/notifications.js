const notificationsRouter = require('express').Router();

const admin = require('firebase-admin');
var serviceAccount = require('../service-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://channel-messaging-ea3f0-default-rtdb.firebaseio.com"
});

// Create FCM instance
const fcm = admin.messaging();

notificationsRouter.get('/', async (req, res) => {

  res.json({});
});

notificationsRouter.post('/subscribe', async (req, res) => { 
  const { token, topic } = await req.body;
  
  console.log('token', token);
  console.log('topic', topic);
  
  try {
    const response = await fcm.subscribeToTopic(token, topic);
    res.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    res.json({ success: false, error });
  }

});

notificationsRouter.post('/unsubscribe', async (req, res) => { 
  const { token, topic } = await req.body;
  
  try {
    const response = await fcm.unsubscribeFromTopic(token, topic);
    res.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    res.json({ success: false, error });
  }
});

notificationsRouter.post('/send', async (req, res) => {
  const { token, title, message, link } = await req.body;

  const payload = {
    token,
    notification: {
      title: title,
      body: message,
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };

  try {
    await admin.messaging().send(payload);

    res.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    res.json({ success: false, error });
  }
});

notificationsRouter.post('/channel', async (req, res) => {
  const { channel, title, body } = req.body;

  if (!channel || !title || !body) {
    return res.status(400).json({ error: 'Channel, title, and body are required.' });
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      topic: channel, // Topic corresponds to the channel
    };

    const response = await fcm.send(message);
    res.status(200).json({ message: 'Notification sent to channel.', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});

notificationsRouter.post('/all', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      topic: 'all', // Assuming 'all' is the topic for all users
    };

    const response = await fcm.send(message);
    res.status(200).json({ message: 'Notification sent to all users.', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});

notificationsRouter.post('/new-channel', async (req, res) => {
  const { channelName } = req.body;

  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required.' });
  }

  try {
    const message = {
      notification: {
        title: 'New Channel Created',
        body: `A new channel "${channelName}" has been created. Subscribe now!`,
      },
      topic: 'all', // Notify all users
    };

    const response = await fcm.send(message);
    res.status(200).json({ message: 'Notification about new channel sent.', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});

notificationsRouter.post('/device', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'Token, title, and body are required.' });
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      token, // Send to specific device
    };

    const response = await fcm.send(message);
    res.status(200).json({ message: 'Notification sent to device.', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});


module.exports = notificationsRouter;
