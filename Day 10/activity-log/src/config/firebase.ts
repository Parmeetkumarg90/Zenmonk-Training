import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY,
    authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
    appId: `${process.env.NEXT_PUBLIC_FIREBASE_APPID}`,
    measurementId: `${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`,
    databaseURL: `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}`,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firbaseDb = getDatabase(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { app, analytics, firbaseDb, auth, provider };