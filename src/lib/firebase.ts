import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAPjDKPAC1-96CciA5ql-8GkHJ6_9xcrtE",
    authDomain: "web-biblia.firebaseapp.com",
    projectId: "web-biblia",
    storageBucket: "web-biblia.firebasestorage.app",
    messagingSenderId: "311467973052",
    appId: "1:311467973052:web:56df9a44fe1356cccfb3b9",
    measurementId: "G-TNK2N2L3DL"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
