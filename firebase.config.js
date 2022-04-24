// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGCOMzGDIO-FGgjweIiIFZfJddAkf6Ypw",
  authDomain: "house-market-place-a95a7.firebaseapp.com",
  projectId: "house-market-place-a95a7",
  storageBucket: "house-market-place-a95a7.appspot.com",
  messagingSenderId: "965025159438",
  appId: "1:965025159438:web:2b2a894bf9740ff4c5df5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore()