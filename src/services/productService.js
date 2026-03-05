import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase/config";

const COLLECTION = "products";

export const getProducts = async () => {
  const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addProduct = async (data) => {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
  });
};

export const updateProduct = async (id, data) => {
  return await updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteProduct = async (id) => {
  return await deleteDoc(doc(db, COLLECTION, id));
};