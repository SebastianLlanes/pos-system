import styles from "./ClosingHistory.module.css";
import { PAYMENT_METHODS } from "../../../constants/paymentMethods";

function ClosingHistory({ history }) {
  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Todavía no hay cierres registrados.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Historial de cierres</h2>
      <div className={styles.list}>
        {history.map((closing) => {
          const isPositive = closing.difference >= 0;
          return (
            <div key={closing.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.date}>{closing.date}</span>
                  <span className={styles.salesCount}>{closing.salesCount} ventas</span>
                </div>
                <div className={styles.totals}>
                  <span className={styles.systemTotal}>
                    Sistema: ${closing.systemTotal?.toLocaleString()}
                  </span>
                  <span className={styles.declaredTotal}>
                    Declarado: ${closing.declaredTotal?.toLocaleString()}
                  </span>
                  <span className={`${styles.difference} ${isPositive ? styles.positive : styles.negative}`}>
                    {isPositive ? "+" : ""}{closing.difference?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Desglose */}
              <div className={styles.breakdown}>
                {PAYMENT_METHODS.map((m) => {
                  const amount = closing.paymentBreakdown?.[m.value] ?? 0;
                  if (amount === 0) return null;
                  return (
                    <span key={m.value} className={styles.breakdownChip}>
                      {m.icon} {m.label}: ${amount.toLocaleString()}
                    </span>
                  );
                })}
              </div>

              {closing.notes && (
                <p className={styles.notes}>📝 {closing.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClosingHistory;