// src/lib/firebase.ts

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJH1i3GmDw1HOWwcWcgb6g93FEDPxQyKA",
  authDomain: "refactor-122de.firebaseapp.com",
  projectId: "refactor-122de",
  storageBucket: "refactor-122de.appspot.com", // corrected the domain
  messagingSenderId: "1011925911800",
  appId: "1:1011925911800:web:b2137bf14519e419b2130d",
  measurementId: "G-9XEQHY0WCN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { analytics, app, auth, db };

