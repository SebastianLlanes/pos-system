import {
  collection, getDocs, query,
  orderBy, where, setDoc, doc,
} from "firebase/firestore";
import { db } from "../../../services/firebase/config";

const COLLECTION = "customers";

const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const getCustomers = async () => {
  const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const saveCustomerIfNew = async (name) => {
  const trimmed = name.trim();
  if (!trimmed) return;

  const normalizedNew = normalize(trimmed);

 // Traemos todos y comparamos normalizado para evitar duplicados con/sin acento
  const all = await getCustomers();
  const exists = all.some((c) => normalize(c.name) === normalizedNew);
  if (exists) return;

  const id = normalizedNew.replace(/\s+/g, "-");
  await setDoc(doc(db, COLLECTION, id), {
    name: trimmed, // guarda el nombre como lo escribieron
    createdAt: new Date().toISOString(),
  });
};