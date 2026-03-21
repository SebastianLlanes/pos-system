import { useState } from "react";
import { saveSale } from "../services/saleService";
import { printTicket } from "../services/printerService";

export function useSale() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const confirmSale = async ({ items, itemsSubtotal, totalDiscount, total, payments, customerName, printReceipt, change }) => {
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
        printReceipt: printReceipt ?? false,
        change: change ?? 0,
      });

      // Imprime siempre al confirmar venta
      try {
        await printTicket({ items, total, payments, customerName, change });
      } catch (printErr) {
        console.error("Error al imprimir:", printErr);
        // La venta ya quedó guardada, no cortamos el flujo
      }

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
