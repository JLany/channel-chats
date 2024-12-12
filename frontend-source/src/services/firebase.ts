// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, initializeAuth, RecaptchaVerifier, setPersistence } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging/sw";
import { getToken } from 'firebase/messaging';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgt4NfknahBmpFdhjPxn9ZZDCZ9Sbly6I",
  authDomain: "channel-messaging-ea3f0.firebaseapp.com",
  projectId: "channel-messaging-ea3f0",
  storageBucket: "channel-messaging-ea3f0.firebasestorage.app",
  messagingSenderId: "352753125918",
  appId: "1:352753125918:web:c5de53355b318879967c0f",
  measurementId: "G-VS01W2SRX2",
  databaseURL: "https://channel-messaging-ea3f0-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(firebaseApp);
export const firebaseMessaging = getMessaging(firebaseApp);
export const database = getDatabase(firebaseApp);

firebaseAuth.languageCode = 'ar';

setPersistence(firebaseAuth, browserLocalPersistence);

export const generateDeviceToken = async () => {
  const permission = await Notification.requestPermission();

  console.log(permission);

  if (permission === 'granted') {
    const token = await getToken(firebaseMessaging, {
      vapidKey: 'BOcuV69-RY7B6ItISWxzaCpCqVPCihwLRwgZNQO4yvfF6byPE2T8Kf7us9Hf3MKZT3h2P5DN2IP6FLc0siLKCg8',
    });

    console.log(token);

    return token;
  }
}


