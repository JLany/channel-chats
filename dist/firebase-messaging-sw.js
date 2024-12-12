// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBgt4NfknahBmpFdhjPxn9ZZDCZ9Sbly6I",
  authDomain: "channel-messaging-ea3f0.firebaseapp.com",
  projectId: "channel-messaging-ea3f0",
  storageBucket: "channel-messaging-ea3f0.firebasestorage.app",
  messagingSenderId: "352753125918",
  appId: "1:352753125918:web:c5de53355b318879967c0f",
  measurementId: "G-VS01W2SRX2",
  databaseURL: "https://channel-messaging-ea3f0-default-rtdb.firebaseio.com"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

messaging.onMessage(function(payload) {

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon,        
  };

  if (!("Notification" in window)) {
      console.log("This browser does not support system notifications.");
  } else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(notificationTitle,notificationOptions);
      notification.onclick = function(event) {
          event.preventDefault();
          window.open(payload.notification.click_action , '_blank');
          notification.close();
      }
  }

  console.log('RUN!');

});
