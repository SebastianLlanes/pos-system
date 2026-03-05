import styles from "./Spinner.module.css";

function Spinner({ fullscreen = false }) {
  if (fullscreen) {
    return (
      <div className={styles.fullscreen}>
        <div className={styles.spinner} />
      </div>
    );
  }
  return <div className={styles.spinner} />;
}

export default Spinner;