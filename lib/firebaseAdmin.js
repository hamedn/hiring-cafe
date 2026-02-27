import { initializeApp, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let app;
const appName = "candidate-admin";

try {
  app = getApp(appName);
} catch {
  app = initializeApp(
    {
      credential: cert({
        client_email: process.env.FIREBASE_HC_CANDIDATES_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_HC_CANDIDATES_PRIVATE_KEY,
        project_id: process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_PROJECT_ID,
      }),
      databaseURL: `${process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_PROJECT_ID}.firebaseio.com`,
      storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_HC_CANDIDATES_PROJECT_ID}.appspot.com`,
    },
    appName
  );
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, Timestamp, FieldValue };
