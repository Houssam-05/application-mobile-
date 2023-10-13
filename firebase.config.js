import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHg4ekcn8GYVHND1MHDGQSo1GwuJaanOw",
  authDomain: "foody-user.firebaseapp.com",
  projectId: "foody-user",
  storageBucket: "foody-user.appspot.com",
  messagingSenderId: "361699588517",
  appId: "1:361699588517:web:9718a604435f820de0904c",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
export { db, auth };
