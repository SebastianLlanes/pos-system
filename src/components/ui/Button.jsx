import styles from "./Button.module.css";

function Button({ children, variant = "primary", size = "md", disabled = false, onClick, type = "button" }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;