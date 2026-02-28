import { auth, db } from "./config";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Login
export const loginUser = async (email, password) => {
    console.log(email, password);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// Logout
export const logoutUser = () => signOut(auth);

// Get user role from Firestore
export const getUserRole = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().role;
    }
    return null;
};

// Auth state listener
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};