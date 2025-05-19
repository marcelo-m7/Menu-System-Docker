// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGRk7vW0ZbABt2HWoPWilB-RaAy42P-ZI",
  authDomain: "menupilot-xkkde.firebaseapp.com",
  projectId: "menupilot-xkkde",
  storageBucket: "menupilot-xkkde.firebasestorage.app",
  messagingSenderId: "364118755668",
  appId: "1:364118755668:web:ba0a0dd99634f76539e0c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the auth instance
const auth = getAuth(app);

export { app, auth };