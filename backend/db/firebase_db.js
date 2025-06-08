// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4y6CxxxCAQmGN-OEUtGpdz6DvnMydC-M",
  authDomain: "fypproject-939a9.firebaseapp.com",
  projectId: "fypproject-939a9",
  storageBucket: "fypproject-939a9.firebasestorage.app",
  messagingSenderId: "846870914088",
  appId: "1:846870914088:web:a7073687d45615e4fac11d",
  measurementId: "G-D8G75J97G1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db= getFirestore();   
connectFirestoreEmulator(db, '127.0.0.1', 2029);

export default db; 