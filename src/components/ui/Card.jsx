import styles from "./Card.module.css";

function Card({ children, padding = "md", shadow = true }) {
  return (
    <div className={`${styles.card} ${styles[`pad-${padding}`]} ${shadow ? styles.shadow : ""}`}>
      {children}
    </div>
  );
}

export default Card;