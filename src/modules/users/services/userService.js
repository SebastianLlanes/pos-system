import {
  collection, doc, getDoc, getDocs,
  setDoc, updateDoc, query, orderBy,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../../../services/firebase/config";

const COLLECTION = "users";

export const createUser = async ({ email, password, name, role }) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, COLLECTION, credential.user.uid), {
    uid: credential.user.uid,
    email,
    name,
    role,
    active: true,
    createdAt: new Date().toISOString(),
  });
  return credential.user;
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, COLLECTION, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const getUsers = async () => {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateUserRole = async (uid, role) => {
  await updateDoc(doc(db, COLLECTION, uid), { role });
};

export const toggleUserActive = async (uid, currentValue) => {
  await updateDoc(doc(db, COLLECTION, uid), { active: !currentValue });
};

export const resetUserPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};