// services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, User, ConfirmationResult } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

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

// CONDITIONAL ANALYTICS INITIALIZATION
let analytics;
// Check if Analytics is supported before initializing
async function initializeAnalytics() {
    if (await isSupported()) {
        analytics = getAnalytics(app);
    }
}
initializeAnalytics();

/* ---------- Auth helpers (Phone OTP using Firebase Auth) ---------- */

/**
 * Setup a reCAPTCHA verifier. Pass the ID of a container element (e.g., 'recaptcha-container').
 * Use size:'invisible' for invisible reCAPTCHA or 'normal' for visible.
 */
export function setupRecaptcha(containerId: string = 'recaptcha-container', invisible: boolean = true) {
  try {
    const verifier = new RecaptchaVerifier(containerId, { size: invisible ? 'invisible' : 'normal' }, auth);
    return verifier;
  } catch (e) {
    console.warn('Recaptcha setup failed (you need firebase/auth Recaptcha support in browser):', e);
    throw e;
  }
}

/**
 * Send OTP to given phone number (E.164 format, e.g., +919876543210)
 * Returns a ConfirmationResult which you must store (session/local) and use to confirm code.
 */
export async function sendOTP(phoneNumber: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  return confirmation;
}

/**
 * Sign out current user
 */
export async function logout() {
  await signOut(auth);
}

/* ---------- Firestore helpers for user/profile and schedules ---------- */

/**
 * Generate a reasonably-unique ID with prefix ('FAC','STD','ADM') e.g. FAC-1694041234567-4829
 */
export function generateUniqueId(prefix: string) {
  const t = Date.now();
  const r = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${t}-${r}`;
}

/**
 * Create or update a user document (faculty, students, admins)
 */
export async function upsertUser(role: 'faculty' | 'students' | 'admins', uid: string, payload: any) {
  const ref = doc(db, role, uid);
  await setDoc(ref, payload, { merge: true });
  return uid;
}

/**
 * Fetch user document
 */
export async function getUser(role: 'faculty' | 'students' | 'admins', uid: string) {
  const ref = doc(db, role, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Add a schedule document to Firestore
 */
export async function addSchedule(payload: any) {
  const col = collection(db, "schedules");
  const docRef = await addDoc(col, payload);
  return docRef.id;
}

/**
 * Helper to create initial profile with avatar options
 */
export const AVATAR_LIST = [
  '/avatars/avatar1.svg',
  '/avatars/avatar2.svg',
  '/avatars/avatar3.svg',
  '/avatars/avatar4.svg',
  '/avatars/avatar5.svg',
  '/avatars/avatar6.svg'
];

export { db, auth };


import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail as sendPwdReset, PhoneAuthProvider } from "firebase/auth";

/* ---------- Email/password helpers ---------- */

/**
 * Create user with email and password (optional)
 */
export async function registerWithEmail(email: string, password: string) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

/**
 * Sign in with email/password
 */
export async function loginWithEmail(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

/**
 * Send password reset email (email provider)
 */
export async function sendPasswordReset(email: string) {
  await sendPwdReset(auth, email);
}

/* ---------- OTP confirm helper ---------- */

/**
 * Confirm the OTP code using a ConfirmationResult returned by sendOTP.
 * You must pass the confirmationResult object returned by sendOTP.
 */
export async function verifyOTP(confirmationResult: any, code: string) {
  const userCred = await confirmationResult.confirm(code);
  return userCred.user;
}
