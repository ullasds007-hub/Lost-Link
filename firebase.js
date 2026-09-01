import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ==========================
// FIREBASE CONFIG
// ==========================

const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};



// ==========================
// INITIALIZE FIREBASE
// ==========================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==========================
// EXPORT FIRESTORE TO LOSTLINK
// ==========================

export {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc
};

console.log("Firebase connected successfully!");