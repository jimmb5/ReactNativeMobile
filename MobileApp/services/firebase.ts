// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
type FirebaseConfig = {
  apiKey ?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

function getFirebaseConfig(): FirebaseConfig {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

// Initialize Firebase

export const firebaseApp = getApps()[0] ?? initializeApp(getFirebaseConfig());

export const db = getFirestore(firebaseApp);