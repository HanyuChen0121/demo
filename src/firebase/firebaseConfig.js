import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqn1aCEe9m8TpJr8LPWaJ4kvvx9HTZ5J4",
  authDomain: "fir-35d6b.firebaseapp.com",
  projectId: "fir-35d6b",
  storageBucket: "fir-35d6b.appspot.com",
  messagingSenderId: "92216957335",
  appId: "1:92216957335:web:1eef2c5a4016daf7308cd2",
  measurementId: "G-02CQQQC9N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);