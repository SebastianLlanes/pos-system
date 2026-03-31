import { useState, useEffect, useCallback } from "react";
import {
  getSalesSince, getLastClosing,
  saveClosing, getClosingHistory,
} from "../services/cashService";
import { PAYMENT_METHODS } from "../../../constants/paymentMethods";

const buildBreakdown = (sales) => {
  const breakdown = {};
  PAYMENT_METHODS.forEach((m) => { breakdown[m.value] = 0; });
  sales.forEach((sale) => {
    sale.payments?.forEach((p) => {
      if (breakdown[p.method] !== undefined) {
        breakdown[p.method] += p.amount;
      }
    });
    // Restá el vuelto del efectivo
    if (sale.change > 0) {
      breakdown["cash"] -= sale.change;
    }
  });
  return breakdown;
};

export function useCashClosing() {
  const [sales, setSales]           = useState([]);
  const [lastClosing, setLastClosing] = useState(null);
  const [history, setHistory]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const last = await getLastClosing();
      setLastClosing(last);

      // Ventas desde el último cierre (o desde hoy al inicio si no hay cierre)
      const fromDate = last?.closedAt?.toDate()
        ?? new Date(new Date().setHours(0, 0, 0, 0));

      const fetchedSales = await getSalesSince(fromDate);
      setSales(fetchedSales);

      const fetchedHistory = await getClosingHistory();
      setHistory(fetchedHistory);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos de caja");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Totales calculados del período actual
  const systemTotal = parseFloat(
    sales.reduce((acc, s) => acc + (s.total ?? 0), 0).toFixed(2)
  );
  const paymentBreakdown = buildBreakdown(sales);
  const salesCount = sales.length;

  const cashTotal = paymentBreakdown?.cash ?? 0;

  const handleClose = async ({ declaredTotal, notes }) => {
    const now   = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
    await saveClosing({
      date: today,
      salesCount,
      systemTotal,
      paymentBreakdown,
      declaredTotal: parseFloat(declaredTotal),
      cashTotal,
      difference: parseFloat((declaredTotal - cashTotal).toFixed(2)),
      notes: notes.trim(),
    });
    await fetchData();
  };

  return {
    sales,
    salesCount,
    systemTotal,
    paymentBreakdown,
    lastClosing,
    history,
    loading,
    error,
    handleClose,
  };
}