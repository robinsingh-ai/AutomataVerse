// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 

} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Helper to get current user
const getCurrentUser = () => auth.currentUser;

// ✅ Helper to get current user
const getCurrentUser = () => auth.currentUser;

// ✅ Google provider
const googleProvider = new GoogleAuthProvider();

// ✅ Exports
export { app, db, auth, getCurrentUser, googleProvider };

// ✅ Utility functions
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const createUser = (email: string, password: string) =>
 createUserWithEmailAndPassword(auth, email, password);
export const signInUser = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);