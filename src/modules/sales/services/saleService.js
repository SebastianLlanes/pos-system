import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../services/firebase/config";
import { saveCustomerIfNew } from "./customerService";

const COLLECTION = "sales";

export const saveSale = async (saleData) => {
  if (saleData.customerName?.trim()) {
    await saveCustomerIfNew(saleData.customerName);
  }

  const isFamilySale = normalize(saleData.customerName ?? "") === "familia";

  return await addDoc(collection(db, COLLECTION), {
    ...saleData,
    family: isFamilySale,
    createdAt: serverTimestamp(),
    status: "completed",
  });
};

const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();