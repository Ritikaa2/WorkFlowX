import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDU9pkSj7OipxE4eReMDfllS0D5KHQ24cE",
  authDomain: "workflowx-ae226.firebaseapp.com",
  projectId: "workflowx-ae226",
  storageBucket: "workflowx-ae226.firebasestorage.app",
  messagingSenderId: "394925382922",
  appId: "1:394925382922:web:75a61a174c2c7de6a0eef3",
  measurementId: "G-K1S4KDCV4W"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };