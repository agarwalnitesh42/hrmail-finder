// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAe_K-jnSOwxj_tQGagzkY3--vvrbQqieA",
  authDomain: "hrmailfinderextension.firebaseapp.com",
  projectId: "hrmailfinderextension",
  storageBucket: "hrmailfinderextension.firebasestorage.app",
  messagingSenderId: "663757330303",
  appId: "1:663757330303:web:d1854200189f4c0424ac4a",
  measurementId: "G-64E0S170TJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication
export const auth = getAuth(app);