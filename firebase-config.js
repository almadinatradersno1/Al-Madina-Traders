// Firebase Configuration & Initialization Module
const firebaseConfig = {
    apiKey: "AIzaSyDzxBculV5EscpuA8uqJ0g1dHY4F9SD2M",
    authDomain: "al-madina-enterprises-786a8.firebaseapp.com",
    projectId: "al-madina-enterprises-786a8",
    storageBucket: "al-madina-enterprises-786a8.firebasestorage.app",
    messagingSenderId: "845696323366",
    appId: "1:845696323366:web:d4864eb0ed1b0f501fbe7",
    measurementId: "G-9TNRD7S5S9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
