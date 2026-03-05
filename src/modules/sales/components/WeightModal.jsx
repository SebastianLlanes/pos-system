import { useState } from "react";
import Button from "../../../components/ui/Button";
import styles from "./WeightModal.module.css";

function WeightModal({ product, onConfirm, onCancel }) {
  const [grams, setGrams] = useState("");

  const handleConfirm = () => {
    const parsed = parseFloat(grams);
    if (!parsed || parsed <= 0) return;
    onConfirm(product, parsed);
  };

  const estimatedPrice =
    grams && parseFloat(grams) > 0
      ? ((parseFloat(grams) / 1000) * product.price).toFixed(2)
      : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.hint}>Precio: ${product.price.toLocaleString()} / kg</p>

        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="number"
            placeholder="0"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            autoFocus
          />
          <span className={styles.unit}>gr</span>
        </div>

        {estimatedPrice && (
          <p className={styles.estimate}>
            Subtotal estimado: <strong>${parseFloat(estimatedPrice).toLocaleString()}</strong>
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!grams || parseFloat(grams) <= 0}
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WeightModal;