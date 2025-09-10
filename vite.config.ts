// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjEToHaEzNgPQsKjK9eVmN0r0ziduOYEc",
  authDomain: "eduscheduler-239ca.firebaseapp.com",
  projectId: "eduscheduler-239ca",
  storageBucket: "eduscheduler-239ca.firebasestorage.app",
  messagingSenderId: "1062454079394",
  appId: "1:1062454079394:web:766f470bc46f61e8c68cfb",
  measurementId: "G-QHMDXZVF6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
