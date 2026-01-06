import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDitGXJC8yTtg1-Rzux6-isKoNnQreh5Xg",
    authDomain: "aura-9f5a3.firebaseapp.com",
    projectId: "aura-9f5a3",
    storageBucket: "aura-9f5a3.appspot.com",
    messagingSenderId: "247426201468",
    appId: "1:247426201468:web:29892b9e0493f3d02b16f9",
    measurementId: "G-G7537TBNVL"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} catch (e) {
    // Fallback for environments where persistence might not be available
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
