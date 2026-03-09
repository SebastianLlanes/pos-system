import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setLeaving(true), 3200);
    const exitTimer = setTimeout(() => onFinish(), 3900);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  return (
    <div className={`${styles.splash} ${leaving ? styles.leaving : ""}`}>
      <div className={styles.powered}>
        <p className={styles.poweredBy}>Powered by</p>
        <p className={styles.name}>Sebastián Llanes</p>
      </div>

      <div className={styles.catchphrase}>
        <span className={styles.word1}>Click.</span>
        <span className={styles.word2}>Scroll.</span>
        <span className={styles.word3}>Wow.</span>
      </div>
    </div>
  );
}

export default SplashScreen;