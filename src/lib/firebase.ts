import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

// Initialize Firebase App instance safely (singleton)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = (config as any).firestoreDatabaseId
  ? getFirestore(app, (config as any).firestoreDatabaseId)
  : getFirestore(app);

/**
 * Creates or retrieves a RecaptchaVerifier on a DOM element container
 */
export function setupRecaptcha(
  containerId: string,
  onSolved?: () => void,
  onExpired?: () => void
): RecaptchaVerifier {
  // Clear any existing window recaptchaVerifier if required
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Previous reCAPTCHA clear error:', e);
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      if (onSolved) onSolved();
    },
    'expired-callback': () => {
      if (onExpired) onExpired();
    },
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Sends a real Firebase Phone SMS verification code
 */
export async function sendFirebasePhoneOtp(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

export type { ConfirmationResult, FirebaseUser };
