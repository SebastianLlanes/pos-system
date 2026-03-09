import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setLeaving(true), 1500);
    const exitTimer = setTimeout(() => onFinish(), 2200);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  return (
    <div className={`${styles.splash} ${leaving ? styles.leaving : ""}`}>
      <p className={styles.powered}>Powered by</p>
      <p className={styles.name}>Sebastián Llanes</p>
    </div>
  );
}

export default SplashScreen;