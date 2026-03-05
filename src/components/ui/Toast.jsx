import { useEffect } from "react";
import styles from "./Toast.module.css";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>
        {type === "success" && "✓"}
        {type === "error"   && "✕"}
        {type === "info"    && "ℹ"}
      </span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}

export default Toast;