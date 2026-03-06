import {
  collection, addDoc, getDocs,
  query, orderBy, where,
  serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "../../../services/firebase/config";

const COLLECTION_CLOSINGS = "cashClosings";
const COLLECTION_SALES    = "sales";

// Trae todas las ventas desde una fecha/hora determinada
export const getSalesSince = async (fromDate) => {
  const from = Timestamp.fromDate(fromDate);
  const q = query(
    collection(db, COLLECTION_SALES),
    where("createdAt", ">=", from),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Trae el último cierre registrado
export const getLastClosing = async () => {
  const q = query(
    collection(db, COLLECTION_CLOSINGS),
    orderBy("closedAt", "desc")
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// Guarda un nuevo cierre
export const saveClosing = async (data) => {
  return await addDoc(collection(db, COLLECTION_CLOSINGS), {
    ...data,
    closedAt: serverTimestamp(),
  });
};

// Trae el historial completo de cierres
export const getClosingHistory = async () => {
  const q = query(
    collection(db, COLLECTION_CLOSINGS),
    orderBy("closedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};