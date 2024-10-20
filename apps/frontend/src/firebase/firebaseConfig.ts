import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCxynOrN0oQEkkwafkvUPCVdsqKwimSSQE",
    authDomain: "tallent-gallery.firebaseapp.com",
    projectId: "tallent-gallery",
    storageBucket: "tallent-gallery.appspot.com",
    messagingSenderId: "1051243471126",
    appId: "1:1051243471126:web:65945268a22a524934f037",
    measurementId: "G-HNJY0Z8Z96"
  };
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth };