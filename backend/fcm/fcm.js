//implemented with firebase fcm
import { initializeApp } from "firebase/app";
import { getMessaging, getToken} from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

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


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);  
getToken(messaging, {vapidKey: "BDmbD27QaAZiDuhYnH3D0zwBiRxH3eBl9vQmrdUcepRktOvObu8T7b1NQnThSABrbnyiZ8rItHI82gdtQfGBJvA"}).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
