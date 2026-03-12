import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../services/firebase/config";
import { saveCustomerIfNew } from "./customerService";

const COLLECTION = "sales";

export const saveSale = async (saleData) => {
  if (saleData.customerName?.trim()) {
    await saveCustomerIfNew(saleData.customerName);
  }
  return await addDoc(collection(db, COLLECTION), {
    ...saleData,
    createdAt: serverTimestamp(),
    status: "completed",
  });
};