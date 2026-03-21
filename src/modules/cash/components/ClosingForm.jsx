import { useState } from "react";
import { PAYMENT_METHODS } from "../../../constants/paymentMethods";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./ClosingForm.module.css";

function ClosingForm({ salesCount, systemTotal, paymentBreakdown, onConfirm }) {
  const [declaredTotal, setDeclaredTotal] = useState("");
  const [notes, setNotes]                 = useState("");
  const [confirm, setConfirm]             = useState(false);

const declared      = parseFloat(declaredTotal) || 0;
const cashTotal     = paymentBreakdown?.cash ?? 0;
const difference    = parseFloat((declared - cashTotal).toFixed(2));
const isPositive    = difference >= 0;

  const handleSubmit = () => {
    if (!confirm) { setConfirm(true); return; }
    onConfirm({ declaredTotal: declared, notes });
    setConfirm(false);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Cierre de caja</h2>

      {/* Resumen del período */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Ventas del período</span>
          <span className={styles.summaryValue}>{salesCount}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total sistema</span>
          <span className={styles.summaryTotal}>
            ${systemTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Desglose por medio de pago */}
      <div className={styles.breakdown}>
        <h3 className={styles.breakdownTitle}>Desglose por medio de pago</h3>
        {PAYMENT_METHODS.map((m) => (
          <div key={m.value} className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}>
              {m.icon} {m.label}
            </span>
            <span className={styles.breakdownAmount}>
              ${(paymentBreakdown[m.value] ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Monto declarado */}
      <Input
        label="Monto físico en caja - solo efectivo ($)"
        type="number"
        value={declaredTotal}
        onChange={(e) => {
          setDeclaredTotal(e.target.value);
          setConfirm(false);
        }}
        placeholder="0.00"
      />

      {/* Diferencia */}
      {declaredTotal !== "" && (
        <div
          className={`${styles.difference} ${isPositive ? styles.positive : styles.negative}`}
        >
          <span>Diferencia</span>
          <strong>
            {isPositive ? "+" : ""}
            {difference.toLocaleString()}
          </strong>
        </div>
      )}

      {/* Notas */}
      <div className={styles.field}>
        <label className={styles.label}>Observaciones (opcional)</label>
        <textarea
          className={styles.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Faltaban $400 en efectivo"
          rows={2}
        />
      </div>

      {/* Confirmación */}
      {confirm && (
        <p className={styles.confirmWarning}>
          ⚠️ Esta acción cerrará el período actual. ¿Confirmar?
        </p>
      )}

      <Button
        variant={confirm ? "danger" : "primary"}
        size="lg"
        onClick={handleSubmit}
        disabled={!declaredTotal}
      >
        {confirm ? "Sí, cerrar caja" : "Cerrar caja"}
      </Button>
    </div>
  );
}

export default ClosingForm;