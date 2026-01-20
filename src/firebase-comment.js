import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBM4YuKWCPxKJnFnsW1KQWTWSuIG8JKzlw",
    authDomain: "sumit-portfolio-1efc3.firebaseapp.com",
    projectId: "sumit-portfolio-1efc3",
    storageBucket: "sumit-portfolio-1efc3.firebasestorage.app",
    messagingSenderId: "893499888790",
    appId: "1:893499888790:web:d984aa70818659dc4c1eb7",
    measurementId: "G-BE871XQN2R"
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };