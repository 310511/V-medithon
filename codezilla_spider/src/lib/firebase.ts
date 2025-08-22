// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAePpEwxlOFgxVCn4tVeVIZ4xnVv-cdKUk",
  authDomain: "medchain-11528.firebaseapp.com",
  projectId: "medchain-11528",
  storageBucket: "medchain-11528.firebasestorage.app",
  messagingSenderId: "123027023076",
  appId: "1:123027023076:web:b071a3a77d48beee67b8f1",
  measurementId: "G-EDSGGHW2VG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export the app instance
export default app;
