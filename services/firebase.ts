// services/firebase.ts (updated)
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, User, ConfirmationResult } from "firebase/auth";
// Removed import for getAnalytics and isSupported

/**
 * Firebase client initialization.
 * Requires environment variables (Vite): VITE_FIREBASE_*
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// Removed all analytics initialization code

/* ---------- Auth helpers (Phone OTP using Firebase Auth) ---------- */
// ... rest of the file remains the same
