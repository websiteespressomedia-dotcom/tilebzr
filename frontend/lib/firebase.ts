// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJzEZ7z4c-TwXgi3BM-h-Zr3232AUv_9I",
  authDomain: "tilebazaar-e3e14.firebaseapp.com",
  projectId: "tilebazaar-e3e14",
  storageBucket: "tilebazaar-e3e14.firebasestorage.app",
  messagingSenderId: "121668828767",
  appId: "1:121668828767:web:db636152e9474de47425ea",
  measurementId: "G-V12TLTGHJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);