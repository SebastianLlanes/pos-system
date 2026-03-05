import { useState } from "react";
import Button from "../../../components/ui/Button";
import styles from "./CartPanel.module.css";

function CartItem({ item, onUpdateQuantity, onRemove, onApplyDiscount }) {
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountMode, setDiscountMode] = useState("percent");

  const handleApplyDiscount = () => {
    const value = parseFloat(discountValue);
    if (!value || value <= 0) return;
    onApplyDiscount(item.id, value, discountMode);
    setShowDiscount(false);
    setDiscountValue("");
  };

  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>{item.name}</span>
          {item.type === "variants" && (
            <span className={styles.itemVariant}>{item.variantName}</span>
          )}
          {item.type === "weight" && (
            <span className={styles.itemVariant}>{item.grams}gr</span>
          )}
        </div>
        <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>✕</button>
      </div>

      <div className={styles.itemFooter}>
        {item.type === "unit" || item.type === "variants" ? (
          <div className={styles.qtyControl}>
            <button className={styles.qtyBtn} onClick={() => onUpdateQuantity(item.id, -1)}>−</button>
            <span className={styles.qty}>{item.quantity}</span>
            <button className={styles.qtyBtn} onClick={() => onUpdateQuantity(item.id, +1)}>+</button>
          </div>
        ) : (
          <div />
        )}

        <div className={styles.itemPricing}>
          {item.discountAmount > 0 && (
            <span className={styles.discount}>-${item.discountAmount.toLocaleString()}</span>
          )}
          <span className={styles.subtotal}>${item.subtotal.toLocaleString()}</span>
        </div>
      </div>

      <button
        className={styles.discountToggle}
        onClick={() => setShowDiscount((v) => !v)}
      >
        {showDiscount ? "Cancelar descuento" : "Aplicar descuento"}
      </button>

      {showDiscount && (
        <div className={styles.discountRow}>
          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeBtn} ${discountMode === "percent" ? styles.modeBtnActive : ""}`}
              onClick={() => setDiscountMode("percent")}
            >%</button>
            <button
              className={`${styles.modeBtn} ${discountMode === "amount" ? styles.modeBtnActive : ""}`}
              onClick={() => setDiscountMode("amount")}
            >$</button>
          </div>
          <input
            className={styles.discountInput}
            type="number"
            placeholder={discountMode === "percent" ? "0%" : "0$"}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
          <Button size="sm" variant="primary" onClick={handleApplyDiscount}>OK</Button>
        </div>
      )}
    </div>
  );
}

function CartPanel({ items, itemsSubtotal, onUpdateQuantity, onRemove, onApplyDiscount, onCharge }) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Orden actual</h2>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <p>Seleccioná productos de la botonera</p>
        </div>
      ) : (
        <>
          <div className={styles.items}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
                onApplyDiscount={onApplyDiscount}
              />
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Subtotal</span>
              <span className={styles.totalAmount}>${itemsSubtotal.toLocaleString()}</span>
            </div>
            <Button variant="success" size="lg" onClick={onCharge}>
              Cobrar ${itemsSubtotal.toLocaleString()}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPanel;