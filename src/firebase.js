import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs } from "@firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBM4YuKWCPxKJnFnsW1KQWTWSuIG8JKzlw",
  authDomain: "sumit-portfolio-1efc3.firebaseapp.com",
  projectId: "sumit-portfolio-1efc3",
  storageBucket: "sumit-portfolio-1efc3.firebasestorage.app",
  messagingSenderId: "893499888790",
  appId: "1:893499888790:web:d984aa70818659dc4c1eb7",
  measurementId: "G-BE871XQN2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc };