import { useState } from "react";
import { saveSale } from "../services/saleService";

export function useSale() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const confirmSale = async ({ items, itemsSubtotal, totalDiscount, total, payments, customerName }) => {
    setLoading(true);
    setError(null);
    try {
      await saveSale({
        items,
        itemsSubtotal,
        discountAmount: totalDiscount,
        total,
        payments,
        customerName: customerName.trim() || "",
      });
      return true;
    } catch (err) {
      console.error(err);
      setError("Error al registrar la venta");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { confirmSale, loading, error };
}