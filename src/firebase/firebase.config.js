// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4ACvh3MkY1b6bshcslryfJkTkf0mzUj8",
    authDomain: "scholarstream-3a872.firebaseapp.com",
    projectId: "scholarstream-3a872",
    storageBucket: "scholarstream-3a872.firebasestorage.app",
    messagingSenderId: "134289518752",
    appId: "1:134289518752:web:ba98dd2dcd8c22af2499c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export default auth;