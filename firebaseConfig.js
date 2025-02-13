import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD_eFOLfdts9xvS2zGsWrGFjroNaL5cKVU',
  authDomain: 'pdieol.firebaseapp.com',
  projectId: 'pdieol',
  storageBucket: 'pdieol.appspot.com',
  messagingSenderId: '434650372807',
  appId: '1:434650372807:android:cf4ecb9f684999f442bce2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
