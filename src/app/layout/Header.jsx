import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase/config";
import { useAuth } from "../providers/AuthProvider";
import styles from "./Header.module.css";

function Header() {
   const { profile } = useAuth();
   const [now, setNow] = useState(new Date());

   useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

   const formatDate = (date) =>
    date.toLocaleDateString("es-AR", {
      weekday: "long",
      day:     "2-digit",
      month:   "long",
      year:    "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("es-AR", {
      hour:   "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

   return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.title}>Sistema de Gestión</span>
      </div>

      <div className={styles.center}>
        <span className={styles.date}>{formatDate(now)}</span>
        <span className={styles.time}>{formatTime(now)}</span>
      </div>

      <div className={styles.right}>
        {profile && (
          <span className={styles.username}>
            Hola, <strong>{profile.name}</strong>
          </span>
        )}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Salir
        </button>
      </div>
    </header>
  );
}

export default Header;