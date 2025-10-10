// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCuJGDrK5WrNYd_E2lM8dYgKZmuR1dmTxw",
  authDomain: "weather-app-b8d67.firebaseapp.com",
  projectId: "weather-app-b8d67",
  storageBucket: "weather-app-b8d67.firebasestorage.app",
  messagingSenderId: "74671379757",
  appId: "1:74671379757:web:f31dfb71a8a4f5d8ec2fa4",
  measurementId: "G-YFYL76QWKR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
