import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

var firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_MEASUREMENT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_STORAGE_BUCKET,
};

let app;
const appName = "candidate-client";

try {
  app = getApp(appName);
} catch {
  app = initializeApp(firebaseConfig, appName);
}

export const clientAuth = getAuth(app);
export const clientFirestore = getFirestore(app);
export const clientStorage = getStorage(app);
