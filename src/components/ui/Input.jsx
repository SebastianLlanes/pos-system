import styles from "./Input.module.css";

function Input({ label, type = "text", value, onChange, placeholder, error, required }) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

export default Input;