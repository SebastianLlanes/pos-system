import Button from "../../../components/ui/Button";
import styles from "./VariantModal.module.css";

function VariantModal({ product, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.hint}>Seleccioná el tamaño</p>

        <div className={styles.variants}>
          {product.variants.map((variant) => (
            <button
              key={variant.name}
              className={styles.variantBtn}
              onClick={() => onConfirm(product, variant)}
            >
              <span className={styles.variantName}>{variant.name}</span>
              <span className={styles.variantPrice}>
                ${variant.price.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}

export default VariantModal;