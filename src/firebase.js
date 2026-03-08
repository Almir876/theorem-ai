import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const fallbackConfig = {
  apiKey: "AIzaSyDCjkQ5tNPmqqYaln3LSihC2u3IKYZA6Ww",
  authDomain: "theorem-ai-417d5.firebaseapp.com",
  projectId: "theorem-ai-417d5",
  storageBucket: "theorem-ai-417d5.firebasestorage.app",
  messagingSenderId: "29569238706",
  appId: "1:29569238706:web:690d799ee5917462c06bab",
};

const envValues = Object.values(envConfig);
const hasAnyEnv = envValues.some(Boolean);
const hasAllEnv = envValues.every(Boolean);

if (hasAnyEnv && !hasAllEnv) {
  throw new Error(
    "Incomplete Firebase env config. Set all VITE_FIREBASE_* vars or none of them."
  );
}

const firebaseConfig = hasAllEnv ? envConfig : fallbackConfig;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set auth persistence:", error);
});
export const db = getFirestore(app);
