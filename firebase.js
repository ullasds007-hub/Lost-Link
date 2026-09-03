// ==========================================
// FIREBASE IMPORTS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAu6t8SbstUh8s4IAk87pdvSNGrtCqbSKA",
    authDomain: "lostlink-f249f.firebaseapp.com",
    projectId: "lostlink-f249f",
    storageBucket: "lostlink-f249f.firebasestorage.app",
    messagingSenderId: "539012412349",
    appId: "1:539012412349:web:971f0208cd61f5fbae98d4"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// INITIALIZE FIRESTORE
// ==========================================

const db = getFirestore(app);


// ==========================================
// EXPORT FIRESTORE FUNCTIONS
// ==========================================

export {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc
};


// ==========================================
// CONNECTION TEST
// ==========================================

console.log("Firebase connected successfully!");