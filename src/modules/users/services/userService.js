import {
  collection, doc, getDoc, getDocs,
  setDoc, updateDoc, deleteDoc,
  query, orderBy,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { auth, db } from "../../../services/firebase/config";

const COLLECTION = "users";

// Segunda instancia para crear usuarios sin cerrar la sesión actual
const secondaryApp = getApps().find((app) => app.name === "secondary")
  ?? initializeApp(auth.app.options, "secondary");

const secondaryAuth = getAuth(secondaryApp);

export const createUser = async ({ email, password, name, role }) => {
   console.log("Creando usuario con:", { email, password, name, role }); 
  const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  await setDoc(doc(db, COLLECTION, credential.user.uid), {
    uid:       credential.user.uid,
    email,
    name,
    role,
    active:    true,
    createdAt: new Date().toISOString(),
  });
  await secondaryAuth.signOut();
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

export const deleteUser = async (uid) => {
  await deleteDoc(doc(db, COLLECTION, uid));
};