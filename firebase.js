// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw11x0lT-VbtsqgoSCc2CegrurKVKHawI",
  authDomain: "inventory-management-3c843.firebaseapp.com",
  projectId: "inventory-management-3c843",
  storageBucket: "inventory-management-3c843.appspot.com",
  messagingSenderId: "942774611553",
  appId: "1:942774611553:web:e4b61570c6cc140ca3c420"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}