// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-KpkiOdTzKG3uKzOAwWteNUyJ3PeCaoI",
  authDomain: "bank-systems.firebaseapp.com",
  projectId: "bank-systems",
  storageBucket: "bank-systems.appspot.com",
  messagingSenderId: "892326738168",
  appId: "1:892326738168:web:3e861a8e0eca4c3444e30d",
  measurementId: "G-158NK7XZMS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app;
