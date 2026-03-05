import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../services/firebase/config";

const COLLECTION = "sales";

export const saveSale = async (saleData) => {
  return await addDoc(collection(db, COLLECTION), {
    ...saleData,
    createdAt: serverTimestamp(),
    status: "completed",
  });
};