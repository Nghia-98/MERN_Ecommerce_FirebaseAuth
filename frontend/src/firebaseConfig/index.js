// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth'

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx6KUBh-btyArTVMYGUe041XsUywKh6uU",
  authDomain: "auth-hnghia.firebaseapp.com",
  projectId: "auth-hnghia",
  storageBucket: "auth-hnghia.appspot.com",
  messagingSenderId: "557507215594",
  appId: "1:557507215594:web:08a046d39eba608adb1793"
};

export const firebase = initializeApp(firebaseConfig);

export const auth = getAuth(firebase);

const googlekAuthProvider = new GoogleAuthProvider();
googlekAuthProvider.addScope('email');

const facebookAuthProvider = new FacebookAuthProvider();
facebookAuthProvider.addScope('email');

export const signInWithGoogle = () => signInWithPopup(auth, googlekAuthProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookAuthProvider)
