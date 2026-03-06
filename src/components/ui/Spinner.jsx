import styles from "./Spinner.module.css";

function Spinner({ fullscreen = false }) {
  if (fullscreen) {
    return (
     <div className={styles.fullscreen}>
        <img
          src="/logo-cupcake.png"
          alt="Cargando..."
          className={styles.cupcake}
        />
      </div>
    );
  }
  return <div className={styles.spinner} />;
}

export default Spinner;