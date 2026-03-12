import { useState, useEffect, useRef } from "react";
import { getCustomers } from "../services/customerService";
import { PAYMENT_METHODS } from "../../../constants/paymentMethods";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./PaymentModal.module.css";

function PaymentModal({ itemsSubtotal, onConfirm, onCancel }) {
  const [customerName, setCustomerName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const [discountValue, setDiscountValue] = useState("");
  const [discountMode, setDiscountMode] = useState("percent");
  const [payments, setPayments] = useState([{ method: "cash", amount: "" }]);

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  // Cerrar sugerencias al clickear afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const handleCustomerChange = (value) => {
   setCustomerName(value);
   if (value.trim().length >= 1) {
     const filtered = customers.filter((c) =>
       normalize(c.name).includes(normalize(value)),
     );
     setSuggestions(filtered);
     setShowSuggestions(filtered.length > 0);
   } else {
     setSuggestions([]);
     setShowSuggestions(false);
   }
 };

 const normalize = (str) =>
   str
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .toLowerCase()
     .trim();

  const handleSelectSuggestion = (name) => {
    setCustomerName(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ── Descuento sobre total ──
  const discountAmount = (() => {
    const val = parseFloat(discountValue);
    if (!val || val <= 0) return 0;
    return discountMode === "percent"
      ? parseFloat(((itemsSubtotal * val) / 100).toFixed(2))
      : Math.min(val, itemsSubtotal);
  })();

  const total = parseFloat((itemsSubtotal - discountAmount).toFixed(2));

  // ── Pagos ──
  const paymentsTotal = payments.reduce(
    (acc, p) => acc + (parseFloat(p.amount) || 0), 0
  );
  const remaining = parseFloat((total - paymentsTotal).toFixed(2));
  const isFullyCovered = remaining <= 0;

  const addPayment = () => {
    setPayments((prev) => [...prev, { method: "cash", amount: "" }]);
  };

  const updatePayment = (index, field, value) => {
    setPayments((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const removePayment = (index) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Vuelto (solo si hay efectivo) ──
  const cashPayment = payments.find((p) => p.method === "cash");
  const cashAmount  = parseFloat(cashPayment?.amount) || 0;
  const change = isFullyCovered && cashAmount > 0
    ? parseFloat((paymentsTotal - total).toFixed(2))
    : 0;

  const handleConfirm = () => {
    const cleanPayments = payments
      .filter((p) => parseFloat(p.amount) > 0)
      .map((p) => ({ method: p.method, amount: parseFloat(p.amount) }));

    onConfirm({
      customerName,
      totalDiscount: discountAmount,
      total,
      payments: cleanPayments,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Cobrar venta</h3>

        {/* Cliente */}
        {/* Cliente */}
        <div className={styles.customerWrapper} ref={suggestionRef}>
          <label className={styles.customerLabel}>
            Nombre del cliente (opcional)
          </label>
          <input
            className={styles.customerInput}
            type="text"
            placeholder="Ej: María García"
            value={customerName}
            onChange={(e) => handleCustomerChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            autoComplete="off"
          />
          {showSuggestions && (
            <div className={styles.suggestions}>
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  className={styles.suggestionItem}
                  onClick={() => handleSelectSuggestion(c.name)}
                  type="button"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Descuento sobre total */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>
            Descuento sobre el total
          </label>
          <div className={styles.discountRow}>
            <div className={styles.modeToggle}>
              <button
                className={`${styles.modeBtn} ${discountMode === "percent" ? styles.modeBtnActive : ""}`}
                onClick={() => setDiscountMode("percent")}
              >
                %
              </button>
              <button
                className={`${styles.modeBtn} ${discountMode === "amount" ? styles.modeBtnActive : ""}`}
                onClick={() => setDiscountMode("amount")}
              >
                $
              </button>
            </div>
            <input
              className={styles.discountInput}
              type="number"
              placeholder={discountMode === "percent" ? "0 %" : "$ 0"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>
        </div>

        {/* Resumen */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${itemsSubtotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
              <span>Descuento</span>
              <span>-${discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Medios de pago */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Medios de pago</label>
          <div className={styles.payments}>
            {payments.map((payment, i) => (
              <div key={i} className={styles.paymentRow}>
                <select
                  className={styles.select}
                  value={payment.method}
                  onChange={(e) => updatePayment(i, "method", e.target.value)}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.icon} {m.label}
                    </option>
                  ))}
                </select>
                <input
                  className={styles.amountInput}
                  type="number"
                  placeholder="$ 0"
                  value={payment.amount}
                  onChange={(e) => updatePayment(i, "amount", e.target.value)}
                />
                {payments.length > 1 && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => removePayment(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className={styles.addPaymentBtn} onClick={addPayment}>
            + Agregar otro medio de pago
          </button>
        </div>

        {/* Restante / Vuelto */}
        <div className={styles.balanceBox}>
          {!isFullyCovered && remaining > 0 && (
            <p className={styles.remaining}>
              Falta cubrir: <strong>${remaining.toLocaleString()}</strong>
            </p>
          )}
          {isFullyCovered && change > 0 && (
            <p className={styles.change}>
              Vuelto: <strong>${change.toLocaleString()}</strong>
            </p>
          )}
          {isFullyCovered && change === 0 && (
            <p className={styles.exact}>✓ Monto exacto</p>
          )}
        </div>

        {/* Acciones */}
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            disabled={!isFullyCovered}
          >
            Confirmar venta
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;