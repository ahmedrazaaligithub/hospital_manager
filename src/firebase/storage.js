import { db } from "./config";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

// Add a document
export const addDocument = async (collectionName, data) => {
    const ref = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return ref.id;
};

// Update a document
export const updateDocument = async (collectionName, id, data) => {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, data);
};

// Delete a document
export const deleteDocument = async (collectionName, id) => {
    const ref = doc(db, collectionName, id);
    await deleteDoc(ref);
};

// Get single document
export const getDocument = async (collectionName, id) => {
    const ref = doc(db, collectionName, id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Get all documents in a collection
export const getCollection = async (collectionName) => {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get documents with a filter
export const getFiltered = async (collectionName, field, operator, value) => {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};