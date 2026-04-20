import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Go to console.firebase.google.com
// 2. Create a new project "Dhrubotara"
// 3. Enable "Authentication" -> "Sign-in method" -> "Phone"
// 4. Enable "Firestore Database" -> "Create Database"
// 5. Enable "Storage" -> "Get Started"
// 6. Project Settings -> General -> "Your apps" -> Web -> Copy config
// ------------------------------------------------------------------

const firebaseConfig = {
  // Replace these with your actual keys from Firebase Console
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket
);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

