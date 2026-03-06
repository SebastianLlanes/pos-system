import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../services/firebase/config";

const fetchCollection = async (collectionName, orderField = "createdAt") => {
  const q = query(
    collection(db, collectionName),
    orderBy(orderField, "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const formatTimestamp = (ts) => {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate().toISOString();
  return ts;
};

const sanitizeData = (data) => {
  if (Array.isArray(data)) return data.map(sanitizeData);
  if (data && typeof data === "object") {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === "object" && value.toDate) {
        result[key] = formatTimestamp(value);
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = sanitizeData(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return data;
};

export const generateBackup = async () => {
  const [products, sales, cashClosings] = await Promise.all([
    fetchCollection("products",     "name"),
    fetchCollection("sales",        "createdAt"),
    fetchCollection("cashClosings", "closedAt"),
  ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    data: {
      products:     sanitizeData(products),
      sales:        sanitizeData(sales),
      cashClosings: sanitizeData(cashClosings),
    },
    summary: {
      totalProducts:     products.length,
      totalSales:        sales.length,
      totalCashClosings: cashClosings.length,
    },
  };

  return backup;
};

export const downloadBackup = (backup) => {
  const date    = new Date().toISOString().split("T")[0];
  const filename = `querert-backup-${date}.json`;
  const json     = JSON.stringify(backup, null, 2);
  const blob     = new Blob([json], { type: "application/json" });
  const url      = URL.createObjectURL(blob);

  const link  = document.createElement("a");
  link.href   = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};